"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db/client";
import { accounts, type QuizAnswers } from "@/db/schema";
import { getCurrentAccount } from "@/lib/session";
import { QUIZ } from "@/lib/quiz";

type Result = { ok: true } | { ok: false; error: string };

const VALID_IDS: Record<string, Set<string>> = Object.fromEntries(
  QUIZ.map((q) => [q.key, new Set(q.options.map((o) => o.id))])
);

export async function saveQuizAction(formData: FormData): Promise<Result> {
  const me = await getCurrentAccount();
  if (!me) return { ok: false, error: "Sign in first." };

  const answers: QuizAnswers = { takenAt: new Date().toISOString() };
  for (const q of QUIZ) {
    const val = String(formData.get(q.key) ?? "");
    if (!val) return { ok: false, error: `Pick an answer for "${q.prompt}".` };
    if (!VALID_IDS[q.key].has(val)) return { ok: false, error: "Invalid answer." };
    (answers as Record<string, string>)[q.key] = val;
  }

  await db.update(accounts).set({ quizAnswers: answers }).where(eq(accounts.id, me.id));
  revalidatePath("/", "layout");
  redirect("/");
}

export async function clearQuizAction(): Promise<void> {
  const me = await getCurrentAccount();
  if (!me) return;
  await db.update(accounts).set({ quizAnswers: null }).where(eq(accounts.id, me.id));
  revalidatePath("/", "layout");
  redirect("/quiz");
}
