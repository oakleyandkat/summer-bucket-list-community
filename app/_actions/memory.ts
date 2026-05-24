"use server";

import { and, eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db/client";
import { memories } from "@/db/schema";
import { IDEA_BY_KEY } from "@/lib/ideas";
import { PACK_IDEA_BY_KEY, isPackIdeaKey } from "@/lib/packs";
import { getCurrentAccount } from "@/lib/session";

function knownIdeaKey(key: string): boolean {
  if (isPackIdeaKey(key)) return !!PACK_IDEA_BY_KEY[key];
  return !!IDEA_BY_KEY[key];
}

const MAX_PHOTO_BYTES = 1_500_000; // ~1.5MB of base64 (~1.1MB raw)
const MAX_CAPTION = 200;

function validatePhoto(photo: string): string | null {
  if (!photo.startsWith("data:image/")) return "Photo must be an image data URL.";
  if (photo.length > MAX_PHOTO_BYTES) return "Photo is too big — try a smaller one.";
  return null;
}

export async function addMemoryAction(
  ideaKey: string,
  photo: string,
  caption: string | null
): Promise<{ ok: true } | { error: string }> {
  const me = await getCurrentAccount();
  if (!me) return { error: "Not signed in." };
  if (!knownIdeaKey(ideaKey)) return { error: "Unknown idea." };

  const photoError = validatePhoto(photo);
  if (photoError) return { error: photoError };

  const cleanCaption = caption?.trim().slice(0, MAX_CAPTION) || null;

  await db
    .insert(memories)
    .values({ accountId: me.id, ideaKey, photo, caption: cleanCaption })
    .onConflictDoUpdate({
      target: [memories.accountId, memories.ideaKey],
      set: { photo, caption: cleanCaption, createdAt: new Date() },
    });

  revalidatePath("/");
  revalidatePath("/memories");
  return { ok: true };
}

export async function updateCaptionAction(
  ideaKey: string,
  caption: string | null
): Promise<{ ok: true } | { error: string }> {
  const me = await getCurrentAccount();
  if (!me) return { error: "Not signed in." };

  const cleanCaption = caption?.trim().slice(0, MAX_CAPTION) || null;

  await db
    .update(memories)
    .set({ caption: cleanCaption })
    .where(and(eq(memories.accountId, me.id), eq(memories.ideaKey, ideaKey)));

  revalidatePath("/");
  revalidatePath("/memories");
  return { ok: true };
}

export async function removeMemoryAction(
  ideaKey: string
): Promise<{ ok: true } | { error: string }> {
  const me = await getCurrentAccount();
  if (!me) return { error: "Not signed in." };

  await db
    .delete(memories)
    .where(and(eq(memories.accountId, me.id), eq(memories.ideaKey, ideaKey)));

  revalidatePath("/");
  revalidatePath("/memories");
  return { ok: true };
}

export async function getMyMemories() {
  const me = await getCurrentAccount();
  if (!me) return [];

  return db
    .select({
      ideaKey: memories.ideaKey,
      photo: memories.photo,
      caption: memories.caption,
      createdAt: memories.createdAt,
    })
    .from(memories)
    .where(eq(memories.accountId, me.id))
    .orderBy(desc(memories.createdAt));
}

export async function getMyMemoryKeys(): Promise<Set<string>> {
  const me = await getCurrentAccount();
  if (!me) return new Set();
  const rows = await db
    .select({ ideaKey: memories.ideaKey })
    .from(memories)
    .where(eq(memories.accountId, me.id));
  return new Set(rows.map((r) => r.ideaKey));
}
