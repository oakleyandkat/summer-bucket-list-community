import Link from "next/link";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { accounts, personalChecks } from "@/db/schema";
import { getCurrentAccount } from "@/lib/session";
import { CATEGORIES, IDEAS } from "@/lib/ideas";
import { logoutAction } from "./_actions/account";
import { AccountFlow } from "./_components/AccountFlow";
import { IdeaCard } from "./_components/IdeaCard";
import { SurpriseMe } from "./_components/SurpriseMe";

function Hero() {
  return (
    <header className="mb-12 text-center">
      <div className="mb-4 inline-block -rotate-2 rounded-full bg-ink px-3.5 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-cream">
        ★ For when summer feels like a blank Sunday ★
      </div>
      <h1 className="font-display text-[clamp(2.4rem,6.5vw,4.8rem)] font-black leading-none tracking-[-0.02em]">
        Stuck on what to do <br />
        this{" "}
        <span className="inline-block -rotate-2 rounded-2xl bg-sun px-3.5 pb-1 shadow-chunky-sm">
          summer
        </span>
        ?
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-[1.15rem] text-ink-soft">
        A bucket list for people who have <em>&ldquo;three months of freedom&rdquo;</em> and absolutely no plan.
        Hit the button. Pick a mood. Go outside. (Or don&apos;t — there are cozy ones too.)
      </p>
    </header>
  );
}

export default async function Home() {
  const me = await getCurrentAccount();

  if (!me) {
    const totalAccounts = await db.$count(accounts);
    return (
      <main className="relative z-10 mx-auto w-full max-w-[960px] px-6 pt-12 pb-20 sm:pt-16">
        <Hero />
        <section className="mx-auto max-w-md rounded-[28px] border-[3px] border-ink bg-white p-7 shadow-chunky-lg">
          <AccountFlow />
        </section>
        <footer className="mt-12 text-center text-sm text-ink-soft">
          {totalAccounts} {totalAccounts === 1 ? "account" : "accounts"} on the wall.
        </footer>
      </main>
    );
  }

  const checkedRows = await db
    .select({ ideaKey: personalChecks.ideaKey })
    .from(personalChecks)
    .where(eq(personalChecks.accountId, me.id));
  const checked = new Set(checkedRows.map((r) => r.ideaKey));
  const uncheckedIdeas = IDEAS.filter((i) => !checked.has(i.key));
  const pct = Math.round((checked.size / IDEAS.length) * 100);

  return (
    <main className="relative z-10 mx-auto w-full max-w-[960px] px-6 pt-12 pb-20 sm:pt-16">
      <Hero />

      <div className="mb-6 flex flex-wrap items-center justify-center gap-2 text-sm">
        <span className="rounded-full border-2 border-ink bg-white px-4 py-1.5 font-black text-ink shadow-chunky-sm">
          🙋 Personal mode
        </span>
        <Link
          href="/rooms"
          className="rounded-full border-2 border-ink bg-sky px-4 py-1.5 font-black text-ink shadow-chunky-sm transition hover:-translate-y-0.5"
        >
          👯 Group rooms →
        </Link>
      </div>

      <SurpriseMe uncheckedIdeas={uncheckedIdeas} />

      {/* Progress card */}
      <section className="mb-6 flex flex-wrap items-center gap-5 rounded-[22px] bg-ink p-6 text-cream">
        <div>
          <div className="font-display text-[2.2rem] font-black leading-none text-sun">
            {checked.size}
          </div>
          <div className="text-[0.95rem] font-bold opacity-85">done so far</div>
        </div>
        <div className="h-3.5 flex-1 min-w-[160px] overflow-hidden rounded-lg bg-white/15">
          <div
            className="h-full bg-gradient-to-r from-sun to-coral transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="text-[0.95rem] font-bold opacity-85">
          {pct}% of the list ({checked.size}/{IDEAS.length})
        </div>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-sm opacity-80">Hey {me.name}</span>
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-xl border-2 border-cream bg-transparent px-3 py-1 text-xs font-bold text-cream hover:bg-coral hover:border-coral"
            >
              Log out
            </button>
          </form>
        </div>
      </section>

      {!me.quizAnswers && (
        <p className="mb-6 rounded-2xl border-[3px] border-dashed border-ink bg-white/60 p-4 text-center text-sm font-bold text-ink-soft">
          ✨ Want this list ranked by your vibe? The vibe quiz is coming next.
        </p>
      )}

      {/* Categories */}
      {CATEGORIES.map((cat) => {
        const ideas = IDEAS.filter((i) => i.category === cat.id);
        return (
          <section key={cat.id} className="mb-8">
            <h3 className="mb-4 flex items-center gap-3 font-display text-2xl font-black">
              <span className="inline-block -rotate-3 rounded-xl border-[3px] border-ink bg-sun px-2.5 py-0.5 text-[1.5rem]">
                {cat.emoji}
              </span>
              <span>{cat.name}</span>
              <small className="font-sans text-[0.9rem] font-normal text-ink-soft">
                — {cat.desc}
              </small>
            </h3>
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
              {ideas.map((idea) => (
                <IdeaCard key={idea.key} idea={idea} checked={checked.has(idea.key)} />
              ))}
            </div>
          </section>
        );
      })}

      <footer className="mt-12 text-center text-sm text-ink-soft">
        Made for the uninspired. Stay weird.
      </footer>
    </main>
  );
}
