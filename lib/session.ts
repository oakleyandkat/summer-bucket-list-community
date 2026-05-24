import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { accounts } from "@/db/schema";

const COOKIE = "sbl_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

export async function setSession(accountId: string) {
  const jar = await cookies();
  jar.set(COOKIE, accountId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function getCurrentAccount() {
  const jar = await cookies();
  const id = jar.get(COOKIE)?.value;
  if (!id) return null;

  const [row] = await db
    .select({
      id: accounts.id,
      name: accounts.name,
      quizAnswers: accounts.quizAnswers,
    })
    .from(accounts)
    .where(eq(accounts.id, id))
    .limit(1);

  return row ?? null;
}
