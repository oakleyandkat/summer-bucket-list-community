import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentAccount } from "@/lib/session";
import { SpinWheel } from "../_components/SpinWheel";

export default async function SpinPage() {
  const me = await getCurrentAccount();
  if (!me) redirect("/");

  return (
    <main className="relative z-10 mx-auto w-full max-w-[720px] px-6 pt-12 pb-20 sm:pt-16">
      <header className="mb-8 text-center">
        <div className="mb-3 inline-block -rotate-2 rounded-full bg-sun px-3.5 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-ink">
          🎰 {me.name}&apos;s spin
        </div>
        <h1 className="font-display text-[clamp(2.2rem,5.5vw,3.8rem)] font-black leading-none tracking-[-0.02em]">
          Spend your{" "}
          <span className="inline-block -rotate-2 rounded-2xl bg-coral px-3.5 pb-1 text-white shadow-chunky-sm">
            coins
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[1.05rem] text-ink-soft">
          10 🪙 a spin. You might get more coins, a lucky idea pick, or a note
          from the universe.
        </p>
      </header>

      <div className="mb-8 flex flex-wrap items-center justify-center gap-2 text-sm">
        <Link
          href="/"
          className="rounded-full border-2 border-ink bg-white px-4 py-1.5 font-black text-ink shadow-chunky-sm transition hover:-translate-y-0.5"
        >
          ← back to the list
        </Link>
        <Link
          href="/memories"
          className="rounded-full border-2 border-ink bg-coral px-4 py-1.5 font-black text-white shadow-chunky-sm transition hover:-translate-y-0.5"
        >
          🌅 memory book
        </Link>
      </div>

      <SpinWheel initialBalance={me.coins} />
    </main>
  );
}
