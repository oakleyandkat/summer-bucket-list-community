import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { accounts, personalChecks } from "@/db/schema";
import { getCurrentAccount } from "@/lib/session";
import { CATEGORIES, IDEAS } from "@/lib/ideas";
import { logoutAction } from "./_actions/account";
import { AccountFlow } from "./_components/AccountFlow";
import { IdeaCard } from "./_components/IdeaCard";
import { SurpriseMe } from "./_components/SurpriseMe";

export default async function Home() {
  const me = await getCurrentAccount();

  if (!me) {
    const totalAccounts = await db.$count(accounts);
    return (
      <main className="min-h-screen bg-gradient-to-b from-amber-50 to-rose-100 p-6 sm:p-12">
        <div className="mx-auto max-w-2xl space-y-6">
          <header className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
              ☀️ Summer Bucket List
            </h1>
            <p className="text-slate-700">Community edition.</p>
          </header>
          <section className="rounded-2xl border-2 border-slate-900 bg-white p-6 shadow-[0_6px_0_theme(colors.slate.900)]">
            <AccountFlow />
          </section>
          <footer className="text-xs text-slate-500">
            {totalAccounts} {totalAccounts === 1 ? "account" : "accounts"} so far.
          </footer>
        </div>
      </main>
    );
  }

  // Logged in: load this account's personal checks
  const checkedRows = await db
    .select({ ideaKey: personalChecks.ideaKey })
    .from(personalChecks)
    .where(eq(personalChecks.accountId, me.id));
  const checked = new Set(checkedRows.map((r) => r.ideaKey));

  const uncheckedIdeas = IDEAS.filter((i) => !checked.has(i.key));

  const ideasByCategory = CATEGORIES.map((cat) => ({
    cat,
    ideas: IDEAS.filter((i) => i.category === cat.id),
  }));

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-rose-100 p-4 sm:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
              ☀️ Summer Bucket List
            </h1>
            <p className="text-sm text-slate-700">
              Hey <span className="font-bold text-rose-600">{me.name}</span> — tap a card to check it off.
            </p>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-lg border-2 border-slate-900 bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 shadow-[0_3px_0_theme(colors.slate.900)] transition hover:translate-y-[1px] hover:shadow-[0_2px_0_theme(colors.slate.900)]"
            >
              Log out
            </button>
          </form>
        </header>

        <section
          aria-label="Progress"
          className="rounded-2xl border-2 border-slate-900 bg-white p-4 shadow-[0_4px_0_theme(colors.slate.900)]"
        >
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-semibold text-slate-700">Your summer so far</span>
            <span className="text-sm font-mono text-slate-900">
              {checked.size} / {IDEAS.length}
            </span>
          </div>
          <div className="mt-2 h-3 w-full overflow-hidden rounded-full border-2 border-slate-900 bg-amber-50">
            <div
              className="h-full bg-rose-500 transition-all"
              style={{ width: `${Math.round((checked.size / IDEAS.length) * 100)}%` }}
            />
          </div>
          {!me.quizAnswers && (
            <p className="mt-3 text-xs text-slate-500">
              ✨ Want this list ranked by your vibe? The vibe quiz is coming next.
            </p>
          )}
        </section>

        <SurpriseMe uncheckedIdeas={uncheckedIdeas} />

        {ideasByCategory.map(({ cat, ideas }) => (
          <section key={cat.id} className="space-y-3">
            <div className="flex items-baseline gap-2">
              <h2 className="text-xl font-bold text-slate-900">
                <span className="mr-1">{cat.emoji}</span>
                {cat.name}
              </h2>
              <span className="text-xs text-slate-500">{cat.desc}</span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {ideas.map((idea) => (
                <IdeaCard key={idea.key} idea={idea} checked={checked.has(idea.key)} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
