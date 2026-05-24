"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db/client";
import { personalChecks } from "@/db/schema";
import { IDEA_BY_KEY } from "@/lib/ideas";
import { getCurrentAccount } from "@/lib/session";

export async function toggleCheckAction(ideaKey: string): Promise<{ checked: boolean } | { error: string }> {
  const me = await getCurrentAccount();
  if (!me) return { error: "Not signed in." };

  // Only canonical ideas can be checked from the personal view for now
  if (!IDEA_BY_KEY[ideaKey]) return { error: "Unknown idea." };

  const existing = await db
    .select()
    .from(personalChecks)
    .where(and(eq(personalChecks.accountId, me.id), eq(personalChecks.ideaKey, ideaKey)))
    .limit(1);

  if (existing.length > 0) {
    await db
      .delete(personalChecks)
      .where(and(eq(personalChecks.accountId, me.id), eq(personalChecks.ideaKey, ideaKey)));
    revalidatePath("/");
    return { checked: false };
  }

  await db.insert(personalChecks).values({ accountId: me.id, ideaKey });
  revalidatePath("/");
  return { checked: true };
}
