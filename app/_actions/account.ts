"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db/client";
import { accounts } from "@/db/schema";
import { hashPin, isValidName, isValidPin, verifyPin } from "@/lib/pin";
import { clearSession, setSession } from "@/lib/session";

type Result<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export async function createAccountAction(formData: FormData): Promise<Result<{ id: string; name: string }>> {
  const name = String(formData.get("name") ?? "").trim();
  const pin = String(formData.get("pin") ?? "");

  if (!isValidName(name)) return { ok: false, error: "Pick a name between 1 and 30 characters." };
  if (!isValidPin(pin)) return { ok: false, error: "PIN must be exactly 4 digits." };

  const pinHash = await hashPin(pin);
  const [row] = await db
    .insert(accounts)
    .values({ name, pinHash })
    .returning({ id: accounts.id, name: accounts.name });

  await setSession(row.id);
  revalidatePath("/");
  return { ok: true, data: row };
}

export async function loginAction(formData: FormData): Promise<Result<{ id: string; name: string }>> {
  const accountId = String(formData.get("accountId") ?? "");
  const pin = String(formData.get("pin") ?? "");

  if (!accountId) return { ok: false, error: "Missing account." };
  if (!isValidPin(pin)) return { ok: false, error: "PIN must be 4 digits." };

  const [row] = await db
    .select({ id: accounts.id, name: accounts.name, pinHash: accounts.pinHash })
    .from(accounts)
    .where(eq(accounts.id, accountId))
    .limit(1);

  if (!row) return { ok: false, error: "Account not found on this server." };

  const ok = await verifyPin(pin, row.pinHash);
  if (!ok) return { ok: false, error: "Wrong PIN." };

  await setSession(row.id);
  revalidatePath("/");
  return { ok: true, data: { id: row.id, name: row.name } };
}

export async function logoutAction(): Promise<void> {
  await clearSession();
  revalidatePath("/");
}
