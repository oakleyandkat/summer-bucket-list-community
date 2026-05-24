import Link from "next/link";
import { redirect } from "next/navigation";
import { PACKS } from "@/lib/packs";
import { getCurrentAccount } from "@/lib/session";
import { getMyPackSlugs } from "../_actions/pack";
import { UnlockPackButton } from "../_components/UnlockPackButton";

export default async function PacksPage() {
  const me = await getCurrentAccount();
  if (!me) redirect("/");

  const myPacks = await getMyPackSlugs();

  return (
    <main className="relative z-10 mx-auto w-full max-w-[1080px] px-6 pt-12 pb-20 sm:pt-16">
      <header className="mb-8 text-center">
        <div className="mb-3 inline-block -rotate-2 rounded-full bg-sky px-3.5 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-ink">
          📦 themed packs
        </div>
        <h1 className="font-display text-[clamp(2.2rem,5.5vw,3.8rem)] font-black leading-none tracking-[-0.02em]">
          Pick a{" "}
          <span className="inline-block -rotate-2 rounded-2xl bg-sun px-3.5 pb-1 shadow-chunky-sm">
            vibe
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-[1.05rem] text-ink-soft">
          Unlock a pack with coins — gets you 8 brand-new ideas tied to a theme.
          Earn coins by checking off ideas on the home page.
        </p>
      </header>

      <div className="mb-8 flex flex-wrap items-center justify-center gap-2 text-sm">
        <Link
          href="/"
          className="rounded-full border-2 border-ink bg-white px-4 py-1.5 font-black text-ink shadow-chunky-sm transition hover:-translate-y-0.5"
        >
          ← back to the list
        </Link>
        <span className="rounded-full border-2 border-ink bg-cream px-4 py-1.5 font-black text-ink shadow-chunky-sm">
          balance: {me.coins} 🪙
        </span>
        <span className="rounded-full border-2 border-ink bg-cream px-4 py-1.5 font-black text-ink shadow-chunky-sm">
          unlocked: {myPacks.size} / {PACKS.length}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PACKS.map((pack) => {
          const unlocked = myPacks.has(pack.slug);
          const affordable = me.coins >= pack.coinCost;
          return (
            <article
              key={pack.slug}
              className={`rounded-3xl border-[3px] border-ink p-6 shadow-chunky-lg transition hover:-translate-y-1 ${
                unlocked ? "bg-white" : "bg-cream"
              }`}
            >
              <div
                className="mb-3 inline-block -rotate-2 rounded-2xl border-[3px] border-ink px-3 pb-1 text-3xl shadow-chunky-sm"
                style={{
                  background: `var(--color-${pack.accent})`,
                }}
              >
                {pack.emoji}
              </div>
              <h2 className="font-display text-2xl font-black leading-tight">
                {pack.name}
              </h2>
              <p className="mt-1 text-[0.9rem] font-bold italic text-ink-soft">
                {pack.tagline}
              </p>

              <ul className="my-4 space-y-1.5 rounded-2xl bg-white/70 p-3">
                {pack.ideas.slice(0, 4).map((idea) => (
                  <li
                    key={idea.key}
                    className={`flex items-start gap-2 text-[0.85rem] font-bold text-ink ${
                      !unlocked ? "blur-[2px]" : ""
                    }`}
                  >
                    <span className="text-base leading-none" aria-hidden>
                      {idea.emoji}
                    </span>
                    <span className="flex-1">{idea.text}</span>
                  </li>
                ))}
                <li className="pt-1 text-[0.7rem] font-black uppercase tracking-wider text-ink-soft">
                  + {pack.ideas.length - 4} more
                </li>
              </ul>

              {unlocked ? (
                <div className="rounded-xl border-[3px] border-ink bg-grass px-4 py-2.5 text-center text-sm font-black text-ink shadow-chunky-sm">
                  ✓ unlocked
                </div>
              ) : (
                <UnlockPackButton
                  slug={pack.slug}
                  cost={pack.coinCost}
                  affordable={affordable}
                />
              )}
            </article>
          );
        })}
      </div>
    </main>
  );
}
