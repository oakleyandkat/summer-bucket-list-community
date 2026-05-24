"use server";

import { and, eq, gt, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db/client";
import { accountPacks, accounts, memories, personalChecks } from "@/db/schema";
import { IDEA_BY_KEY } from "@/lib/ideas";
import {
  PACK_IDEA_BY_KEY,
  isPackIdeaKey,
  packSlugFromIdeaKey,
} from "@/lib/packs";
import { getCurrentAccount } from "@/lib/session";

const FARM_WINDOW_MINUTES = 10;
const FARM_MAX_REWARDS = 3;

type ToggleResult =
  | { checked: false }
  | { checked: true; coinsEarned: number; antiFarmActive: boolean }
  | { error: string };

export async function toggleCheckAction(ideaKey: string): Promise<ToggleResult> {
  const me = await getCurrentAccount();
  if (!me) return { error: "Not signed in." };

  if (isPackIdeaKey(ideaKey)) {
    if (!PACK_IDEA_BY_KEY[ideaKey]) return { error: "Unknown idea." };
    const slug = packSlugFromIdeaKey(ideaKey);
    if (!slug) return { error: "Unknown idea." };
    const owned = await db
      .select({ packSlug: accountPacks.packSlug })
      .from(accountPacks)
      .where(and(eq(accountPacks.accountId, me.id), eq(accountPacks.packSlug, slug)))
      .limit(1);
    if (owned.length === 0) return { error: "You haven't unlocked that pack." };
  } else if (!IDEA_BY_KEY[ideaKey]) {
    return { error: "Unknown idea." };
  }

  const existing = await db
    .select()
    .from(personalChecks)
    .where(and(eq(personalChecks.accountId, me.id), eq(personalChecks.ideaKey, ideaKey)))
    .limit(1);

  if (existing.length > 0) {
    await db
      .delete(personalChecks)
      .where(and(eq(personalChecks.accountId, me.id), eq(personalChecks.ideaKey, ideaKey)));
    // Unchecking also removes the memory — otherwise it becomes an orphan
    // the user can't see or edit. Coins already earned stay earned.
    await db
      .delete(memories)
      .where(and(eq(memories.accountId, me.id), eq(memories.ideaKey, ideaKey)));
    revalidatePath("/");
    revalidatePath("/memories");
    revalidatePath("/packs");
    return { checked: false };
  }

  // Anti-farm: at most FARM_MAX_REWARDS rewarded checks within the last
  // FARM_WINDOW_MINUTES. Beyond that, the check still works but no coins.
  // We compute the window with PGlite's own NOW() so we avoid any timezone
  // disagreement between Node's Date and the column's stored timestamp.
  const recentRewarded = await db
    .select({ ideaKey: personalChecks.ideaKey })
    .from(personalChecks)
    .where(
      and(
        eq(personalChecks.accountId, me.id),
        gt(
          personalChecks.checkedAt,
          sql`NOW() - INTERVAL '${sql.raw(String(FARM_WINDOW_MINUTES))} minutes'`
        ),
        gt(personalChecks.coinsAwarded, 0)
      )
    );

  const antiFarmActive = recentRewarded.length >= FARM_MAX_REWARDS;
  const coinsEarned = antiFarmActive ? 0 : Math.floor(Math.random() * 9) + 1;

  await db.insert(personalChecks).values({
    accountId: me.id,
    ideaKey,
    coinsAwarded: coinsEarned,
  });

  if (coinsEarned > 0) {
    await db
      .update(accounts)
      .set({ coins: sql`${accounts.coins} + ${coinsEarned}` })
      .where(eq(accounts.id, me.id));
  }

  revalidatePath("/");
  revalidatePath("/packs");
  return { checked: true, coinsEarned, antiFarmActive };
}
