"use client";

import { useState, useTransition } from "react";
import { toggleCheckAction } from "../_actions/check";
import type { Idea } from "@/lib/ideas";

export function SurpriseMe({ uncheckedIdeas }: { uncheckedIdeas: Idea[] }) {
  const [picked, setPicked] = useState<Idea | null>(null);
  const [pending, startTransition] = useTransition();
  const [spinKey, setSpinKey] = useState(0);

  function pickRandom(exclude?: string) {
    const pool = exclude
      ? uncheckedIdeas.filter((i) => i.key !== exclude)
      : uncheckedIdeas;
    if (pool.length === 0) {
      setPicked(null);
      return;
    }
    setPicked(pool[Math.floor(Math.random() * pool.length)]);
    setSpinKey((k) => k + 1);
  }

  function markDone() {
    if (!picked) return;
    startTransition(async () => {
      await toggleCheckAction(picked.key);
      setPicked(null);
    });
  }

  return (
    <div className="mb-7 rounded-[28px] border-[3px] border-ink bg-white p-7 text-center shadow-chunky-lg">
      <h2 className="font-display text-2xl font-black">🎲 Can&apos;t decide?</h2>
      <p className="mt-1 text-[0.95rem] text-ink-soft">Let summer decide for you.</p>

      <button
        type="button"
        onClick={() => pickRandom(picked?.key)}
        disabled={pending || uncheckedIdeas.length === 0}
        className="mt-5 inline-flex items-center gap-2.5 rounded-[18px] border-[3px] border-ink bg-coral px-7 py-3.5 text-[1.1rem] font-black text-white shadow-[0_6px_0_var(--color-ink)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_0_var(--color-ink)] active:translate-y-1 active:shadow-[0_2px_0_var(--color-ink)] disabled:opacity-50"
      >
        <span>{picked ? "🎲" : "🍦"}</span>
        <span>{picked ? "Surprise me again" : "Surprise me"}</span>
      </button>

      <div
        key={spinKey}
        className={`mt-6 min-h-[80px] rounded-[18px] border-2 border-dashed border-ink bg-cream p-6 ${
          picked ? "animate-[pop_0.4s_ease-out]" : ""
        }`}
      >
        {picked ? (
          <>
            <div className="flex items-center justify-center gap-2 font-display text-[1.5rem] font-bold">
              <span className="text-[2rem]" aria-hidden>{picked.emoji}</span>
              <span>{picked.text}</span>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={markDone}
                disabled={pending}
                className="inline-flex items-center gap-1.5 rounded-2xl border-[3px] border-ink bg-grass px-4 py-2 text-sm font-black text-ink shadow-[0_4px_0_var(--color-ink)] transition hover:-translate-y-0.5 hover:shadow-[0_5px_0_var(--color-ink)] active:translate-y-0.5 active:shadow-[0_2px_0_var(--color-ink)] disabled:opacity-60"
              >
                {pending ? "Saving…" : "✓ Done it!"}
              </button>
              <button
                type="button"
                onClick={() => setPicked(null)}
                className="text-sm text-ink-soft underline"
              >
                maybe later
              </button>
            </div>
          </>
        ) : (
          <div className="font-sans italic text-[1.1rem] font-normal text-ink-soft">
            {uncheckedIdeas.length === 0
              ? "🎉 You did them ALL. Iconic."
              : "Tap the button — get a random thing to do."}
          </div>
        )}
      </div>
    </div>
  );
}
