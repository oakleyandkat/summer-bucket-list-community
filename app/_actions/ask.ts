"use server";

import { and, eq, gte, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db/client";
import { accounts } from "@/db/schema";
import { suggestIdea } from "@/lib/ai";
import { getCurrentAccount } from "@/lib/session";

const ASK_COST = 15;

export type AskResult =
  | {
      ok: true;
      idea: { emoji: string; text: string };
      source: "claude" | "mock";
      balance: number;
    }
  | { error: string };

export async function askUniverseAction(): Promise<AskResult> {
  const me = await getCurrentAccount();
  if (!me) return { error: "Not signed in." };

  if (me.coins < ASK_COST) {
    return { error: `Not enough coins — you need ${ASK_COST} 🪙.` };
  }

  const charged = await db
    .update(accounts)
    .set({ coins: sql`${accounts.coins} - ${ASK_COST}` })
    .where(and(eq(accounts.id, me.id), gte(accounts.coins, ASK_COST)))
    .returning();

  if (charged.length === 0) {
    return { error: `Not enough coins — you need ${ASK_COST} 🪙.` };
  }

  const suggestion = await suggestIdea(me.quizAnswers);

  revalidatePath("/");
  return {
    ok: true,
    idea: { emoji: suggestion.emoji, text: suggestion.text },
    source: suggestion.source,
    balance: charged[0].coins,
  };
}
