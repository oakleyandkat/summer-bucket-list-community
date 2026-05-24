"use server";

import { and, eq, gte, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db/client";
import { accountPacks, accounts } from "@/db/schema";
import { PACK_BY_SLUG, type PackSlug } from "@/lib/packs";
import { getCurrentAccount } from "@/lib/session";

export type UnlockResult =
  | { ok: true; balance: number }
  | { error: string };

export async function unlockPackAction(slug: string): Promise<UnlockResult> {
  const me = await getCurrentAccount();
  if (!me) return { error: "Not signed in." };

  const pack = PACK_BY_SLUG[slug as PackSlug];
  if (!pack) return { error: "Unknown pack." };

  const owned = await db
    .select()
    .from(accountPacks)
    .where(
      and(
        eq(accountPacks.accountId, me.id),
        eq(accountPacks.packSlug, slug)
      )
    )
    .limit(1);

  if (owned.length > 0) return { error: "You already have this pack." };

  // Atomic charge — only succeeds if balance is still >= cost.
  const charged = await db
    .update(accounts)
    .set({ coins: sql`${accounts.coins} - ${pack.coinCost}` })
    .where(and(eq(accounts.id, me.id), gte(accounts.coins, pack.coinCost)))
    .returning();

  if (charged.length === 0) {
    return { error: `Not enough coins — you need ${pack.coinCost} 🪙.` };
  }

  await db.insert(accountPacks).values({
    accountId: me.id,
    packSlug: slug,
  });

  revalidatePath("/");
  revalidatePath("/packs");
  return { ok: true, balance: charged[0].coins };
}

export async function getMyPackSlugs(): Promise<Set<string>> {
  const me = await getCurrentAccount();
  if (!me) return new Set();
  const rows = await db
    .select({ packSlug: accountPacks.packSlug })
    .from(accountPacks)
    .where(eq(accountPacks.accountId, me.id));
  return new Set(rows.map((r) => r.packSlug));
}
