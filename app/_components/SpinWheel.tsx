"use client";

import { useState, useTransition } from "react";
import { spinAction, type SpinResult } from "../_actions/spin";

const SPIN_COST = 10;

const REWARD_LABELS: Record<SpinResult["kind"], string> = {
  jackpot: "🎉 JACKPOT",
  big: "🌟 Nice",
  mid: "🪙 Cool",
  small: "🌅 A little something",
  luckyPick: "🎟 Lucky pick",
  compliment: "💫 A note for you",
};

export function SpinWheel({ initialBalance }: { initialBalance: number }) {
  const [balance, setBalance] = useState(initialBalance);
  const [pending, startTransition] = useTransition();
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<SpinResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function onSpin() {
    if (balance < SPIN_COST) return;
    setError(null);
    setResult(null);
    setSpinning(true);

    startTransition(async () => {
      // Spin animation runs for ~1.6s while the server rolls the reward
      const [spinResult] = await Promise.all([
        spinAction(),
        new Promise((r) => setTimeout(r, 1600)),
      ]);
      setSpinning(false);

      if ("error" in spinResult) {
        setError(spinResult.error);
        return;
      }
      setBalance(spinResult.balance);
      setResult(spinResult);
    });
  }

  const canSpin = balance >= SPIN_COST && !pending;

  return (
    <div className="mx-auto max-w-md">
      <section className="rounded-[28px] border-[3px] border-ink bg-white p-8 text-center shadow-chunky-lg">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-cream px-3 py-1.5 text-sm font-black text-ink">
          your balance: {balance} 🪙
        </div>

        <div
          className={`mx-auto my-6 flex h-44 w-44 items-center justify-center rounded-full border-[6px] border-ink bg-gradient-to-br from-sun via-coral to-sky text-6xl shadow-chunky-lg transition ${
            spinning ? "animate-spin" : ""
          }`}
          style={{ animationDuration: spinning ? "0.5s" : undefined }}
          aria-hidden
        >
          🎰
        </div>

        <button
          type="button"
          onClick={onSpin}
          disabled={!canSpin}
          className="w-full rounded-2xl border-[3px] border-ink bg-sun px-6 py-3 font-display text-2xl font-black text-ink shadow-chunky-lg transition hover:-translate-y-1 hover:rotate-[-1deg] disabled:cursor-not-allowed disabled:bg-cream disabled:opacity-60"
        >
          {spinning
            ? "spinning…"
            : balance < SPIN_COST
            ? `need ${SPIN_COST} 🪙 to spin`
            : `Spin (${SPIN_COST} 🪙)`}
        </button>

        {balance < SPIN_COST && !spinning && (
          <p className="mt-3 text-xs font-bold text-ink-soft">
            check off ideas on the home page to earn coins
          </p>
        )}

        {error && (
          <p className="mt-4 rounded-xl border-2 border-coral bg-coral/10 px-3 py-2 text-sm font-bold text-coral">
            {error}
          </p>
        )}
      </section>

      {result && (
        <section
          className="mt-6 rounded-[28px] border-[3px] border-ink bg-cream p-6 text-center shadow-chunky-lg animate-[wobble_0.5s_ease]"
          aria-live="polite"
        >
          <div className="text-[0.7rem] font-black uppercase tracking-wider text-ink-soft">
            you got
          </div>
          <div className="mt-1 font-display text-3xl font-black text-ink">
            {REWARD_LABELS[result.kind]}
          </div>

          {"coins" in result && (
            <div className="mt-4 inline-block -rotate-1 rounded-2xl border-[3px] border-ink bg-sun px-5 py-2 font-display text-4xl font-black shadow-chunky-sm">
              +{result.coins} 🪙
            </div>
          )}

          {result.kind === "luckyPick" && (
            <div className="mt-4 rounded-2xl border-[3px] border-ink bg-white p-4">
              <div className="text-xs font-black uppercase tracking-wider text-ink-soft">
                your lucky idea
              </div>
              <div className="mt-2 flex items-center justify-center gap-3 text-left">
                <span className="text-3xl" aria-hidden>
                  {result.idea.emoji}
                </span>
                <span className="font-bold text-ink">{result.idea.text}</span>
              </div>
            </div>
          )}

          {result.kind === "compliment" && (
            <p className="mt-4 rounded-2xl border-[3px] border-dashed border-ink bg-white px-4 py-3 font-display text-xl font-black italic text-ink">
              {result.message}
            </p>
          )}
        </section>
      )}
    </div>
  );
}
