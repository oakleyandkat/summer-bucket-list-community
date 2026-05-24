"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db/client";
import { roomMembers, rooms, suggestions, votes } from "@/db/schema";
import { generateRoomCode, isValidRoomCode, normalizeRoomCode } from "@/lib/codes";
import { getCurrentAccount } from "@/lib/session";
import { IDEA_BY_KEY } from "@/lib/ideas";

type Err = { ok: false; error: string };
type Ok<T> = { ok: true; data: T };

async function requireAccount() {
  const me = await getCurrentAccount();
  if (!me) throw new Error("Not signed in.");
  return me;
}

export async function createRoomAction(formData: FormData): Promise<Ok<{ code: string }> | Err> {
  const me = await getCurrentAccount();
  if (!me) return { ok: false, error: "Sign in first." };

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { ok: false, error: "Give your room a name." };
  if (name.length > 40) return { ok: false, error: "Room name must be 40 characters or fewer." };

  // Try a few times in case of code collision
  for (let attempt = 0; attempt < 8; attempt++) {
    const code = generateRoomCode();
    try {
      const [row] = await db
        .insert(rooms)
        .values({ code, name, ownerId: me.id })
        .returning();
      await db
        .insert(roomMembers)
        .values({ roomId: row.id, accountId: me.id })
        .onConflictDoNothing();
      revalidatePath("/rooms");
      return { ok: true, data: { code: row.code } };
    } catch {
      // Likely the unique-index collision on code — try a new one.
      continue;
    }
  }
  return { ok: false, error: "Couldn't generate a unique room code. Try again." };
}

export async function joinRoomAction(formData: FormData): Promise<Ok<{ code: string }> | Err> {
  const me = await getCurrentAccount();
  if (!me) return { ok: false, error: "Sign in first." };

  const raw = String(formData.get("code") ?? "");
  const code = normalizeRoomCode(raw);
  if (!isValidRoomCode(code)) return { ok: false, error: "Room codes are 6 letters/numbers." };

  const [room] = await db
    .select({ id: rooms.id, code: rooms.code })
    .from(rooms)
    .where(eq(rooms.code, code))
    .limit(1);
  if (!room) return { ok: false, error: "No room with that code." };

  await db
    .insert(roomMembers)
    .values({ roomId: room.id, accountId: me.id })
    .onConflictDoNothing();

  revalidatePath("/rooms");
  return { ok: true, data: { code: room.code } };
}

export async function leaveRoomAction(formData: FormData): Promise<void> {
  const me = await requireAccount();
  const roomId = String(formData.get("roomId") ?? "");
  if (!roomId) return;
  await db
    .delete(roomMembers)
    .where(and(eq(roomMembers.roomId, roomId), eq(roomMembers.accountId, me.id)));
  revalidatePath("/rooms");
  redirect("/rooms");
}

export async function toggleVoteAction(
  roomId: string,
  ideaKey: string
): Promise<{ voted: boolean } | { error: string }> {
  const me = await getCurrentAccount();
  if (!me) return { error: "Sign in first." };

  // Verify membership
  const [membership] = await db
    .select()
    .from(roomMembers)
    .where(and(eq(roomMembers.roomId, roomId), eq(roomMembers.accountId, me.id)))
    .limit(1);
  if (!membership) return { error: "You're not in this room." };

  // Verify the ideaKey refers to either a canonical idea or a suggestion in THIS room
  if (ideaKey.startsWith("c-")) {
    if (!IDEA_BY_KEY[ideaKey]) return { error: "Unknown idea." };
  } else if (ideaKey.startsWith("s-")) {
    const suggestionId = ideaKey.slice(2);
    const [sug] = await db
      .select()
      .from(suggestions)
      .where(and(eq(suggestions.id, suggestionId), eq(suggestions.roomId, roomId)))
      .limit(1);
    if (!sug) return { error: "Suggestion not in this room." };
  } else {
    return { error: "Unknown idea key." };
  }

  const existing = await db
    .select()
    .from(votes)
    .where(
      and(
        eq(votes.roomId, roomId),
        eq(votes.accountId, me.id),
        eq(votes.ideaKey, ideaKey)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    await db
      .delete(votes)
      .where(
        and(
          eq(votes.roomId, roomId),
          eq(votes.accountId, me.id),
          eq(votes.ideaKey, ideaKey)
        )
      );
    revalidatePath("/rooms", "layout");
    return { voted: false };
  }
  await db.insert(votes).values({ roomId, accountId: me.id, ideaKey });
  revalidatePath(`/rooms/${roomId}`);
  return { voted: true };
}

export async function suggestIdeaAction(
  roomId: string,
  formData: FormData
): Promise<Ok<{ id: string }> | Err> {
  const me = await getCurrentAccount();
  if (!me) return { ok: false, error: "Sign in first." };

  const text = String(formData.get("text") ?? "").trim();
  const emoji = String(formData.get("emoji") ?? "").trim() || "✨";

  if (!text) return { ok: false, error: "Add some text." };
  if (text.length > 200) return { ok: false, error: "Keep it under 200 characters." };

  const [membership] = await db
    .select()
    .from(roomMembers)
    .where(and(eq(roomMembers.roomId, roomId), eq(roomMembers.accountId, me.id)))
    .limit(1);
  if (!membership) return { ok: false, error: "You're not in this room." };

  const [row] = await db
    .insert(suggestions)
    .values({ roomId, text, emoji, authorId: me.id })
    .returning();

  revalidatePath("/rooms", "layout");
  return { ok: true, data: { id: row.id } };
}
