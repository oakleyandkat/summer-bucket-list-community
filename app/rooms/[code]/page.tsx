import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { accounts, roomMembers, rooms, suggestions, votes } from "@/db/schema";
import { IDEAS } from "@/lib/ideas";
import { getCurrentAccount } from "@/lib/session";
import { logoutAction } from "../../_actions/account";
import { leaveRoomAction } from "../../_actions/room";
import { VoteButton } from "../../_components/VoteButton";
import { SuggestForm } from "../../_components/SuggestForm";

type Item = {
  ideaKey: string;
  emoji: string;
  text: string;
  source: "canonical" | "suggestion";
  authorName?: string;
  voteCount: number;
  voted: boolean;
};

export default async function RoomPage({ params }: { params: Promise<{ code: string }> }) {
  const { code: codeParam } = await params;
  const code = codeParam.toUpperCase();

  const me = await getCurrentAccount();
  if (!me) {
    return (
      <main className="relative z-10 mx-auto w-full max-w-md px-6 pt-20 text-center">
        <p className="rounded-2xl border-[3px] border-ink bg-white p-6 shadow-chunky-sm">
          Sign in first.{" "}
          <Link href="/" className="font-bold text-coral underline">
            Go →
          </Link>
        </p>
      </main>
    );
  }

  const [room] = await db
    .select({ id: rooms.id, code: rooms.code, name: rooms.name, ownerId: rooms.ownerId })
    .from(rooms)
    .where(eq(rooms.code, code))
    .limit(1);
  if (!room) notFound();

  const [membership] = await db
    .select()
    .from(roomMembers)
    .where(and(eq(roomMembers.roomId, room.id), eq(roomMembers.accountId, me.id)))
    .limit(1);
  if (!membership) {
    return (
      <main className="relative z-10 mx-auto w-full max-w-md px-6 pt-20 text-center">
        <p className="rounded-2xl border-[3px] border-ink bg-white p-6 shadow-chunky-sm">
          You&apos;re not in this room.{" "}
          <Link href="/rooms" className="font-bold text-coral underline">
            Join with the code →
          </Link>
        </p>
      </main>
    );
  }

  const members = await db
    .select({ id: accounts.id, name: accounts.name })
    .from(roomMembers)
    .innerJoin(accounts, eq(accounts.id, roomMembers.accountId))
    .where(eq(roomMembers.roomId, room.id));

  const roomSuggestions = await db
    .select({
      id: suggestions.id,
      text: suggestions.text,
      emoji: suggestions.emoji,
      authorId: suggestions.authorId,
      authorName: accounts.name,
    })
    .from(suggestions)
    .innerJoin(accounts, eq(accounts.id, suggestions.authorId))
    .where(eq(suggestions.roomId, room.id));

  const voteRows = await db
    .select({ ideaKey: votes.ideaKey, accountId: votes.accountId })
    .from(votes)
    .where(eq(votes.roomId, room.id));

  const voteCountByKey = new Map<string, number>();
  const myVotes = new Set<string>();
  for (const v of voteRows) {
    voteCountByKey.set(v.ideaKey, (voteCountByKey.get(v.ideaKey) ?? 0) + 1);
    if (v.accountId === me.id) myVotes.add(v.ideaKey);
  }

  const items: Item[] = [
    ...IDEAS.map((i) => ({
      ideaKey: i.key,
      emoji: i.emoji,
      text: i.text,
      source: "canonical" as const,
      voteCount: voteCountByKey.get(i.key) ?? 0,
      voted: myVotes.has(i.key),
    })),
    ...roomSuggestions.map((s) => {
      const key = `s-${s.id}`;
      return {
        ideaKey: key,
        emoji: s.emoji ?? "✨",
        text: s.text,
        source: "suggestion" as const,
        authorName: s.authorName,
        voteCount: voteCountByKey.get(key) ?? 0,
        voted: myVotes.has(key),
      };
    }),
  ].sort((a, b) => b.voteCount - a.voteCount || a.text.localeCompare(b.text));

  const top3 = items.filter((i) => i.voteCount > 0).slice(0, 3);
  const totalVotes = voteRows.length;

  return (
    <main className="relative z-10 mx-auto w-full max-w-[960px] px-6 pt-10 pb-20">
      <div className="mb-2 flex items-center justify-between text-sm">
        <Link href="/rooms" className="font-bold text-ink-soft underline hover:text-coral">
          ← all rooms
        </Link>
        <div className="flex items-center gap-3 text-ink-soft">
          <span>{me.name}</span>
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-lg border-2 border-ink bg-white px-3 py-1 text-xs font-bold text-ink hover:bg-coral hover:text-white"
            >
              Log out
            </button>
          </form>
        </div>
      </div>

      <header className="mb-8 rounded-[28px] border-[3px] border-ink bg-white p-7 shadow-chunky-lg">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.12em] text-ink-soft">Room</p>
            <h1 className="font-display text-3xl sm:text-4xl font-black leading-none">{room.name}</h1>
          </div>
          <div className="text-right">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-ink-soft">Share code</p>
            <div className="mt-1 inline-block rounded-xl border-[3px] border-ink bg-sun px-4 py-2 font-mono text-2xl font-black tracking-[0.3em] shadow-chunky-sm">
              {room.code}
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-ink-soft">In this room:</span>
          {members.map((m) => (
            <span
              key={m.id}
              className="rounded-full border-2 border-ink bg-cream px-3 py-0.5 text-sm font-bold text-ink"
            >
              {m.name}
              {m.id === room.ownerId && <span className="ml-1 text-xs text-coral">★</span>}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-ink-soft">
          <span>{totalVotes} {totalVotes === 1 ? "vote" : "votes"} cast</span>
          {membership && (
            <form action={leaveRoomAction}>
              <input type="hidden" name="roomId" value={room.id} />
              <button type="submit" className="underline hover:text-coral">
                Leave room
              </button>
            </form>
          )}
        </div>
      </header>

      {top3.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 font-display text-2xl font-black">🏆 Top picks</h2>
          <ol className="space-y-3">
            {top3.map((item, i) => (
              <li
                key={item.ideaKey}
                className={`flex items-center gap-4 rounded-2xl border-[3px] border-ink p-4 shadow-chunky-sm ${
                  i === 0 ? "bg-sun" : i === 1 ? "bg-sky/60" : "bg-coral/30"
                }`}
              >
                <div className="font-display text-3xl font-black text-ink">#{i + 1}</div>
                <div className="text-3xl" aria-hidden>{item.emoji}</div>
                <div className="flex-1">
                  <div className="text-lg font-bold text-ink">{item.text}</div>
                  {item.source === "suggestion" && (
                    <div className="text-xs text-ink-soft">suggested by {item.authorName}</div>
                  )}
                </div>
                <VoteButton
                  roomId={room.id}
                  ideaKey={item.ideaKey}
                  voted={item.voted}
                  count={item.voteCount}
                />
              </li>
            ))}
          </ol>
        </section>
      )}

      <section className="mb-8">
        <h2 className="mb-3 font-display text-2xl font-black">Everything to vote on</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <li
              key={item.ideaKey}
              className={`flex items-start gap-3 rounded-2xl border-[3px] border-ink p-4 shadow-chunky-sm transition hover:-translate-y-0.5 ${
                item.source === "suggestion" ? "bg-cream" : "bg-white"
              }`}
            >
              <div className="text-2xl leading-none shrink-0" aria-hidden>
                {item.emoji}
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-ink">{item.text}</div>
                {item.source === "suggestion" && (
                  <div className="mt-1 text-xs text-ink-soft">
                    suggested by {item.authorName}
                  </div>
                )}
              </div>
              <VoteButton
                roomId={room.id}
                ideaKey={item.ideaKey}
                voted={item.voted}
                count={item.voteCount}
              />
            </li>
          ))}
        </ul>
      </section>

      <SuggestForm roomId={room.id} />
    </main>
  );
}
