"use client";

import { useEffect, useState } from "react";
import { createAccountAction, loginAction } from "../_actions/account";

type KnownAccount = { id: string; name: string };
const LS_KEY = "sbl_known_accounts";

function loadKnown(): KnownAccount[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as KnownAccount[]) : [];
  } catch {
    return [];
  }
}

function rememberAccount(acct: KnownAccount) {
  const filtered = loadKnown().filter((a) => a.id !== acct.id);
  filtered.unshift(acct);
  window.localStorage.setItem(LS_KEY, JSON.stringify(filtered.slice(0, 8)));
}

type View = "picker" | "create" | "pin";

export function AccountFlow() {
  const [known, setKnown] = useState<KnownAccount[]>([]);
  const [view, setView] = useState<View>("picker");
  const [selected, setSelected] = useState<KnownAccount | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const list = loadKnown();
    setKnown(list);
    if (list.length === 0) setView("create");
    setMounted(true);
  }, []);

  async function onCreate(formData: FormData) {
    setError(null);
    setPending(true);
    const result = await createAccountAction(formData);
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    rememberAccount(result.data);
    window.location.reload();
  }

  async function onLogin(formData: FormData) {
    if (!selected) return;
    formData.set("accountId", selected.id);
    setError(null);
    setPending(true);
    const result = await loginAction(formData);
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    rememberAccount(result.data);
    window.location.reload();
  }

  if (!mounted) {
    return <div className="text-ink-soft text-sm">Loading…</div>;
  }

  return (
    <div className="space-y-4 text-left">
      {view === "picker" && (
        <div className="space-y-3">
          <h2 className="font-display text-xl font-black">Who&apos;s using this device?</h2>
          {known.length > 0 ? (
            <ul className="space-y-2">
              {known.map((a) => (
                <li key={a.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelected(a);
                      setError(null);
                      setView("pin");
                    }}
                    className="w-full rounded-2xl border-[3px] border-ink bg-sun px-4 py-3 text-left text-lg font-black text-ink shadow-chunky-sm transition hover:-translate-y-0.5"
                  >
                    {a.name}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-ink-soft">No accounts on this device yet.</p>
          )}
          <button
            type="button"
            onClick={() => {
              setError(null);
              setView("create");
            }}
            className="text-sm font-bold text-coral underline hover:text-coral-deep"
          >
            + Create a new account
          </button>
        </div>
      )}

      {view === "pin" && selected && (
        <form action={onLogin} className="space-y-4">
          <h2 className="font-display text-xl font-black">
            Welcome back, <span className="text-coral">{selected.name}</span>
          </h2>
          <label className="block">
            <span className="block text-sm font-bold text-ink-soft">4-digit PIN</span>
            <input
              type="text"
              inputMode="numeric"
              pattern="\d{4}"
              maxLength={4}
              autoFocus
              required
              name="pin"
              className="mt-1 w-full rounded-xl border-[3px] border-ink bg-white px-4 py-3 text-2xl tracking-[0.5em] font-mono text-center text-ink focus:outline-none focus:ring-2 focus:ring-coral"
            />
          </label>
          {error && <p className="text-sm font-bold text-coral-deep">{error}</p>}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={pending}
              className="rounded-2xl border-[3px] border-ink bg-coral px-5 py-2.5 font-black text-white shadow-chunky-sm transition hover:-translate-y-0.5 disabled:opacity-60"
            >
              {pending ? "Checking…" : "Log in"}
            </button>
            <button
              type="button"
              onClick={() => {
                setError(null);
                setSelected(null);
                setView("picker");
              }}
              className="text-sm text-ink-soft underline"
            >
              ← back
            </button>
          </div>
        </form>
      )}

      {view === "create" && (
        <form action={onCreate} className="space-y-4">
          <h2 className="font-display text-xl font-black">Create your account</h2>
          <label className="block">
            <span className="block text-sm font-bold text-ink-soft">Your name</span>
            <input
              type="text"
              name="name"
              required
              maxLength={30}
              placeholder="e.g. Oakley"
              autoFocus
              className="mt-1 w-full rounded-xl border-[3px] border-ink bg-white px-4 py-3 text-lg text-ink focus:outline-none focus:ring-2 focus:ring-coral"
            />
          </label>
          <label className="block">
            <span className="block text-sm font-bold text-ink-soft">
              Pick a 4-digit PIN <span className="text-ink-soft/70">(you&apos;ll use this to log in)</span>
            </span>
            <input
              type="text"
              inputMode="numeric"
              pattern="\d{4}"
              maxLength={4}
              required
              name="pin"
              className="mt-1 w-full rounded-xl border-[3px] border-ink bg-white px-4 py-3 text-2xl tracking-[0.5em] font-mono text-center text-ink focus:outline-none focus:ring-2 focus:ring-coral"
            />
          </label>
          {error && <p className="text-sm font-bold text-coral-deep">{error}</p>}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={pending}
              className="rounded-2xl border-[3px] border-ink bg-grass px-5 py-2.5 font-black text-ink shadow-chunky-sm transition hover:-translate-y-0.5 disabled:opacity-60"
            >
              {pending ? "Creating…" : "Create account"}
            </button>
            {known.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setView("picker");
                }}
                className="text-sm text-ink-soft underline"
              >
                ← back
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
