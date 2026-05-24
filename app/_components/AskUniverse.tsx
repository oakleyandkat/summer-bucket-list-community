"use client";

import { useState, useTransition } from "react";
import { askUniverseAction, type AskResult } from "../_actions/ask";

const ASK_COST = 15;

export function AskUniverse({ initialBalance }: { initialBalance: number }) {
  const [balance, setBalance] = useState(initialBalance);
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<Extract<AskResult, { ok: true }> | null>(null);
  const [error, setError] = useState<string | null>(null);

  function onAsk() {
    setError(null);
    startTransition(async () => {
      const r = await askUniverseAction();
      if ("error" in r) {
        setError(r.error);
        return;
      }
      setBalance(r.balance);
      setResult(r);
    });
  }

  const canAfford = balance >= ASK_COST && !pending;

  return (
    <section className="mb-6 rounded-[22px] border-[3px] border-ink bg-white p-5 shadow-chunky-sm">
      <div className="flex flex-wrap items-center gap-3">
        <div className="text-3xl" aria-hidden>
          🔮
        </div>
        <div className="flex-1 min-w-[160px]">
          <h3 className="font-display text-xl font-black leading-tight">
            Ask the universe
          </h3>
          <p className="text-[0.85rem] font-bold text-ink-soft">
            Get a custom idea made for your vibe.
          </p>
        </div>
        <button
          type="button"
          onClick={onAsk}
          disabled={!canAfford}
          className="rounded-xl border-[3px] border-ink bg-coral px-4 py-2 text-sm font-black text-white shadow-chunky-sm transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-cream disabled:text-ink-soft disabled:opacity-70"
        >
          {pending
            ? "asking…"
            : balance < ASK_COST
            ? `need ${ASK_COST} 🪙`
            : `Ask (${ASK_COST} 🪙)`}
        </button>
      </div>

      {error && (
        <p className="mt-3 rounded-lg border-2 border-coral bg-coral/10 px-3 py-2 text-sm font-bold text-coral">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-4 rounded-2xl border-[3px] border-ink bg-cream p-4 animate-[wobble_0.5s_ease]">
          <div className="text-[0.7rem] font-black uppercase tracking-wider text-ink-soft">
            ✨ for you
          </div>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-3xl" aria-hidden>
              {result.idea.emoji}
            </span>
            <span className="font-bold text-ink">{result.idea.text}</span>
          </div>
          {result.source === "mock" && (
            <div className="mt-3 rounded-lg border-2 border-dashed border-ink-soft bg-white/60 px-2 py-1 text-[0.65rem] font-bold text-ink-soft">
              ⚙️ mock response — add ANTHROPIC_API_KEY in Suga for real AI suggestions
            </div>
          )}
        </div>
      )}
    </section>
  );
}
