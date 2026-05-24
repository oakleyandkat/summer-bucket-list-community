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
      className={`group flex items-start gap-3 rounded-2xl border-[3px] border-ink p-[18px] text-left shadow-chunky-sm transition hover:-translate-y-[3px] hover:rotate-[-0.5deg] disabled:cursor-wait ${
        optimisticChecked ? "bg-cream opacity-65" : "bg-white"
      }`}
    >
      <div className="text-2xl leading-none shrink-0" aria-hidden>
        {idea.emoji}
      </div>
      <div className="flex-1">
        <div
          className={`text-[1rem] font-bold ${
            optimisticChecked
              ? "line-through decoration-coral decoration-[3px]"
              : ""
          }`}
        >
          {idea.text}
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {idea.moods.map((m) => (
            <span
              key={m}
              className="rounded-[10px] bg-cream px-2 py-0.5 text-[0.7rem] font-black lowercase text-ink-soft"
            >
              {m}
            </span>
          ))}
        </div>
      </div>
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-[3px] border-ink text-base font-black text-ink ${
          optimisticChecked ? "bg-grass animate-[wobble_0.5s_ease]" : "bg-white"
        }`}
      >
        {optimisticChecked && "✓"}
      </div>
    </button>
  );
}
