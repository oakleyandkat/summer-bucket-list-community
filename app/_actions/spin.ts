"use server";

import { and, eq, gte, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db/client";
import { accounts, personalChecks } from "@/db/schema";
import { IDEAS } from "@/lib/ideas";
import { getCurrentAccount } from "@/lib/session";

const SPIN_COST = 10;

type RewardKind =
  | "jackpot"
  | "big"
  | "mid"
  | "small"
  | "luckyPick"
  | "compliment";

// Weights must sum to 100.
const REWARDS: { kind: RewardKind; weight: number }[] = [
  { kind: "jackpot", weight: 5 },
  { kind: "big", weight: 5 },
  { kind: "mid", weight: 30 },
  { kind: "small", weight: 30 },
  { kind: "luckyPick", weight: 15 },
  { kind: "compliment", weight: 15 },
];

const COMPLIMENTS = [
  "you're the moment 🌅",
  "summer's lucky to have you 🌞",
  "iconic decision making 💫",
  "literally a vibe ✨",
  "the sun rises bc of you 🌻",
  "you contain multitudes 🪼",
  "main character behavior 🍑",
];

export type SpinResult =
  | { kind: "jackpot"; coins: 100; balance: number }
  | { kind: "big"; coins: 25; balance: number }
  | { kind: "mid"; coins: 10; balance: number }
  | { kind: "small"; coins: 5; balance: number }
  | {
      kind: "luckyPick";
      idea: { key: string; emoji: string; text: string };
      balance: number;
    }
  | { kind: "compliment"; message: string; balance: number };

function rollReward(): RewardKind {
  const r = Math.random() * 100;
  let acc = 0;
  for (const reward of REWARDS) {
    acc += reward.weight;
    if (r < acc) return reward.kind;
  }
  return REWARDS[REWARDS.length - 1].kind;
}

export async function spinAction(): Promise<SpinResult | { error: string }> {
  const me = await getCurrentAccount();
  if (!me) return { error: "Not signed in." };

  if (me.coins < SPIN_COST) {
    return { error: `Not enough coins — you need ${SPIN_COST} 🪙.` };
  }

  // Charge the spin atomically (only if balance is still >= cost). Guards
  // against double-spins racing past the balance check above.
  const charged = await db
    .update(accounts)
    .set({ coins: sql`${accounts.coins} - ${SPIN_COST}` })
    .where(and(eq(accounts.id, me.id), gte(accounts.coins, SPIN_COST)))
    .returning();

  if (charged.length === 0) {
    return { error: `Not enough coins — you need ${SPIN_COST} 🪙.` };
  }
  let balance = charged[0].coins;

  const kind = rollReward();

  if (kind === "jackpot" || kind === "big" || kind === "mid" || kind === "small") {
    const payout =
      kind === "jackpot" ? 100 : kind === "big" ? 25 : kind === "mid" ? 10 : 5;
    const credited = await db
      .update(accounts)
      .set({ coins: sql`${accounts.coins} + ${payout}` })
      .where(eq(accounts.id, me.id))
      .returning();
    balance = credited[0].coins;
    revalidatePath("/");
    revalidatePath("/spin");
    return { kind, coins: payout, balance } as SpinResult;
  }

  if (kind === "luckyPick") {
    const checkedRows = await db
      .select({ ideaKey: personalChecks.ideaKey })
      .from(personalChecks)
      .where(eq(personalChecks.accountId, me.id));
    const checkedKeys = new Set(checkedRows.map((r) => r.ideaKey));
    const pool = IDEAS.filter((i) => !checkedKeys.has(i.key));
    const choices = pool.length > 0 ? pool : IDEAS;
    const idea = choices[Math.floor(Math.random() * choices.length)];
    revalidatePath("/");
    revalidatePath("/spin");
    return {
      kind: "luckyPick",
      idea: { key: idea.key, emoji: idea.emoji, text: idea.text },
      balance,
    };
  }

  const message = COMPLIMENTS[Math.floor(Math.random() * COMPLIMENTS.length)];
  revalidatePath("/");
  revalidatePath("/spin");
  return { kind: "compliment", message, balance };
}
