"use client";

import { useOptimistic, useTransition } from "react";
import { toggleCheckAction } from "../_actions/check";
import type { Idea } from "@/lib/ideas";

export function IdeaCard({ idea, checked }: { idea: Idea; checked: boolean }) {
  const [pending, startTransition] = useTransition();
  const [optimisticChecked, setOptimisticChecked] = useOptimistic(checked);

  function onClick() {
    startTransition(async () => {
      setOptimisticChecked(!optimisticChecked);
      await toggleCheckAction(idea.key);
    });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className={`group relative rounded-2xl border-2 border-slate-900 p-4 text-left shadow-[0_4px_0_theme(colors.slate.900)] transition hover:translate-y-[2px] hover:shadow-[0_2px_0_theme(colors.slate.900)] disabled:cursor-wait ${
        optimisticChecked
          ? "bg-emerald-100 line-through decoration-emerald-700 decoration-2"
          : "bg-white"
      }`}
    >
      <div className="flex items-start gap-3 pr-8">
        <div className="text-3xl leading-none shrink-0" aria-hidden>
          {idea.emoji}
        </div>
        <div className="flex-1 text-sm sm:text-base font-medium text-slate-900">
          {idea.text}
        </div>
      </div>
      {optimisticChecked && (
        <div className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white text-sm font-bold shadow-[0_2px_0_theme(colors.slate.900)] border-2 border-slate-900">
          ✓
        </div>
      )}
    </button>
  );
}
