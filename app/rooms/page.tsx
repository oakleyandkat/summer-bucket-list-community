import Link from "next/link";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { roomMembers, rooms } from "@/db/schema";
import { getCurrentAccount } from "@/lib/session";
import { logoutAction } from "../_actions/account";
import { CreateRoomForm } from "../_components/CreateRoomForm";
import { JoinRoomForm } from "../_components/JoinRoomForm";

export default async function RoomsHome() {
  const me = await getCurrentAccount();
  if (!me) {
    return (
      <main className="relative z-10 mx-auto w-full max-w-md px-6 pt-20 text-center">
        <p className="rounded-2xl border-[3px] border-ink bg-white p-6 shadow-chunky-sm">
          You need an account before joining a room.{" "}
          <Link href="/" className="font-bold text-coral underline">
            Go sign in →
          </Link>
        </p>
      </main>
    );
  }

  // Rooms I'm a member of, with member count
  const myRooms = await db
    .select({
      id: rooms.id,
      code: rooms.code,
      name: rooms.name,
      memberCount: sql<number>`(select count(*) from ${roomMembers} where ${roomMembers.roomId} = ${rooms.id})`.mapWith(Number),
    })
    .from(rooms)
    .innerJoin(roomMembers, eq(roomMembers.roomId, rooms.id))
    .where(eq(roomMembers.accountId, me.id));

  return (
    <main className="relative z-10 mx-auto w-full max-w-[960px] px-6 pt-12 pb-20 sm:pt-16">
      <header className="mb-10 text-center">
        <div className="mb-3 inline-block -rotate-2 rounded-full bg-ink px-3.5 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-cream">
          ★ Summer with friends ★
        </div>
        <h1 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-black leading-none tracking-[-0.02em]">
          Group{" "}
          <span className="inline-block -rotate-2 rounded-2xl bg-sky px-3 pb-1 shadow-chunky-sm">
            rooms
          </span>
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-[1.05rem] text-ink-soft">
          Make a room. Share the 6-letter code. Everybody votes on what y&apos;all actually
          want to do this summer.
        </p>
      </header>

      <div className="mb-10 grid gap-5 sm:grid-cols-2">
        <section className="rounded-[24px] border-[3px] border-ink bg-white p-6 shadow-chunky-sm">
          <h2 className="mb-1 font-display text-xl font-black">🏖 Start a room</h2>
          <p className="mb-4 text-sm text-ink-soft">You&apos;ll get a code to share.</p>
          <CreateRoomForm />
        </section>
        <section className="rounded-[24px] border-[3px] border-ink bg-white p-6 shadow-chunky-sm">
          <h2 className="mb-1 font-display text-xl font-black">🚪 Got a code?</h2>
          <p className="mb-4 text-sm text-ink-soft">Type it in to join.</p>
          <JoinRoomForm />
        </section>
      </div>

      <section className="mb-10">
        <h2 className="mb-4 font-display text-2xl font-black">Your rooms</h2>
        {myRooms.length === 0 ? (
          <div className="rounded-2xl border-[3px] border-dashed border-ink bg-white/60 p-10 text-center text-ink-soft">
            <div className="mb-2 text-4xl">🏝️</div>
            <p>You&apos;re not in any rooms yet. Make one or join with a code.</p>
          </div>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {myRooms.map((r) => (
              <li key={r.id}>
                <Link
                  href={`/rooms/${r.code}`}
                  className="block rounded-2xl border-[3px] border-ink bg-white p-5 shadow-chunky-sm transition hover:-translate-y-1 hover:rotate-[-0.5deg]"
                >
                  <div className="font-display text-xl font-black">{r.name}</div>
                  <div className="mt-1 flex items-center gap-3 text-sm text-ink-soft">
                    <span className="rounded-md bg-cream px-2 py-0.5 font-mono font-bold tracking-widest">
                      {r.code}
                    </span>
                    <span>
                      👥 {r.memberCount} {r.memberCount === 1 ? "member" : "members"}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer className="flex items-center justify-between text-sm text-ink-soft">
        <Link href="/" className="font-bold underline hover:text-coral">
          ← Back to personal list
        </Link>
        <div className="flex items-center gap-3">
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
      </footer>
    </main>
  );
}
