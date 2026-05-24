import { db } from "@/db/client";
import { accounts } from "@/db/schema";
import { getCurrentAccount } from "@/lib/session";
import { logoutAction } from "./_actions/account";
import { AccountFlow } from "./_components/AccountFlow";

export default async function Home() {
  const me = await getCurrentAccount();
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
          {me ? (
            <div className="space-y-3">
              <p className="text-sm text-slate-500">Signed in as</p>
              <h2 className="text-2xl font-bold text-slate-900">{me.name}</h2>
              {!me.quizAnswers && (
                <p className="text-sm text-rose-700">
                  ✨ You haven&apos;t taken the vibe quiz yet — coming soon.
                </p>
              )}
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="rounded-lg border-2 border-slate-900 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-[0_3px_0_theme(colors.slate.900)] transition hover:translate-y-[1px] hover:shadow-[0_2px_0_theme(colors.slate.900)]"
                >
                  Log out
                </button>
              </form>
            </div>
          ) : (
            <AccountFlow />
          )}
        </section>

        <footer className="text-xs text-slate-500">
          {totalAccounts} {totalAccounts === 1 ? "account" : "accounts"} total · Next: vibe quiz, then personal/group modes.
        </footer>
      </div>
    </main>
  );
}
