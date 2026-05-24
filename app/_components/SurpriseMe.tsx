"use client";

import { useState, useTransition } from "react";
import { toggleCheckAction } from "../_actions/check";
import type { Idea } from "@/lib/ideas";

export function SurpriseMe({ uncheckedIdeas }: { uncheckedIdeas: Idea[] }) {
  const [picked, setPicked] = useState<Idea | null>(null);
  const [pending, startTransition] = useTransition();
  const [spinKey, setSpinKey] = useState(0); // forces animation re-trigger

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

  if (uncheckedIdeas.length === 0 && !picked) {
    return (
      <div className="rounded-2xl border-2 border-slate-900 bg-emerald-100 p-5 text-center shadow-[0_4px_0_theme(colors.slate.900)]">
        <p className="text-lg font-bold text-emerald-900">🎉 You did them ALL.</p>
        <p className="text-sm text-emerald-800">Iconic summer. Make a new list?</p>
      </div>
    );
  }

  if (!picked) {
    return (
      <button
        type="button"
        onClick={() => pickRandom()}
        className="w-full rounded-2xl border-2 border-slate-900 bg-amber-300 px-6 py-5 text-xl font-bold text-slate-900 shadow-[0_6px_0_theme(colors.slate.900)] transition hover:translate-y-[3px] hover:shadow-[0_3px_0_theme(colors.slate.900)] active:translate-y-[5px] active:shadow-[0_1px_0_theme(colors.slate.900)]"
      >
        🎲 Surprise me with one
      </button>
    );
  }

  return (
    <div
      key={spinKey}
      className="rounded-2xl border-2 border-slate-900 bg-gradient-to-br from-amber-200 to-rose-200 p-5 shadow-[0_6px_0_theme(colors.slate.900)] animate-[popIn_0.3s_ease-out]"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-rose-700">
        Tonight&apos;s mission
      </p>
      <div className="mt-2 flex items-start gap-3">
        <div className="text-5xl leading-none" aria-hidden>
          {picked.emoji}
        </div>
        <p className="flex-1 text-xl font-semibold text-slate-900">{picked.text}</p>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={markDone}
          disabled={pending}
          className="rounded-xl border-2 border-slate-900 bg-emerald-500 px-4 py-2 text-sm font-bold text-white shadow-[0_4px_0_theme(colors.slate.900)] transition hover:translate-y-[2px] hover:shadow-[0_2px_0_theme(colors.slate.900)] disabled:opacity-60"
        >
          {pending ? "Saving…" : "✓ I did it!"}
        </button>
        <button
          type="button"
          onClick={() => pickRandom(picked.key)}
          disabled={pending}
          className="rounded-xl border-2 border-slate-900 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-[0_4px_0_theme(colors.slate.900)] transition hover:translate-y-[2px] hover:shadow-[0_2px_0_theme(colors.slate.900)] disabled:opacity-60"
        >
          🎲 Try another
        </button>
        <button
          type="button"
          onClick={() => setPicked(null)}
          className="text-sm text-slate-600 underline ml-1"
        >
          maybe later
        </button>
      </div>
    </div>
  );
}
