import { db } from "@/db/client";
import { accounts } from "@/db/schema";

export default async function Home() {
  const rows = await db.select({ id: accounts.id, name: accounts.name }).from(accounts);

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-rose-100 p-8 sm:p-16">
      <div className="mx-auto max-w-2xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-4xl font-bold text-slate-900">
            ☀️ Summer Bucket List — Community
          </h1>
          <p className="text-slate-700">Scaffold is alive. DB is connected.</p>
        </header>

        <section className="rounded-2xl border-2 border-slate-900 bg-white p-6 shadow-[0_6px_0_theme(colors.slate.900)]">
          <h2 className="text-xl font-semibold text-slate-900">Accounts in the DB</h2>
          <p className="mt-2 text-3xl font-bold text-rose-600">{rows.length}</p>
          {rows.length > 0 ? (
            <ul className="mt-4 space-y-1 text-slate-800">
              {rows.map((a) => (
                <li key={a.id}>· {a.name}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-slate-500">
              No accounts yet. Next step: build the account create/login flow.
            </p>
          )}
        </section>

        <footer className="text-sm text-slate-600">
          <p>Wired up: Next.js + Tailwind + Drizzle + PGlite.</p>
          <p>Next: account flow (name + 4-digit PIN), then quiz, then group rooms.</p>
        </footer>
      </div>
    </main>
  );
}
