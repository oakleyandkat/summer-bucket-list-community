"use client";

import { useOptimistic, useState, useTransition } from "react";
import { toggleCheckAction } from "../_actions/check";
import { MemoryButton } from "./MemoryButton";
import type { Idea } from "@/lib/ideas";

export type IdeaCardMemory = {
  photo: string;
  caption: string | null;
} | null;

export function IdeaCard({
  idea,
  checked,
  memory = null,
}: {
  idea: Idea;
  checked: boolean;
  memory?: IdeaCardMemory;
}) {
  const [pending, startTransition] = useTransition();
  const [optimisticChecked, setOptimisticChecked] = useOptimistic(checked);
  const [reward, setReward] = useState<
    { coins: number; antiFarm: boolean } | null
  >(null);

  function onToggle() {
    startTransition(async () => {
      setOptimisticChecked(!optimisticChecked);
      const result = await toggleCheckAction(idea.key);
      if ("error" in result) return;
      if (result.checked === true) {
        setReward({ coins: result.coinsEarned, antiFarm: result.antiFarmActive });
        setTimeout(() => setReward(null), 2200);
      }
    });
  }

  return (
    <div
      className={`relative rounded-2xl border-[3px] border-ink p-[18px] shadow-chunky-sm transition ${
        optimisticChecked ? "bg-cream" : "bg-white"
      }`}
    >
      {reward && (
        <div
          className="pointer-events-none absolute -top-3 right-3 z-10 rounded-full border-[3px] border-ink px-3 py-1 text-sm font-black text-ink shadow-chunky-sm animate-[wobble_0.5s_ease]"
          style={{
            background: reward.coins > 0 ? "var(--color-sun)" : "var(--color-cream)",
          }}
        >
          {reward.coins > 0
            ? `+${reward.coins} 🪙`
            : reward.antiFarm
            ? "🐢 slow down — no coins"
            : "✓"}
        </div>
      )}

      <button
        type="button"
        onClick={onToggle}
        disabled={pending}
        className={`group flex w-full items-start gap-3 text-left transition hover:rotate-[-0.5deg] disabled:cursor-wait ${
          optimisticChecked ? "opacity-65" : ""
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

      {optimisticChecked && (
        <MemoryButton
          ideaKey={idea.key}
          ideaText={idea.text}
          ideaEmoji={idea.emoji}
          memory={memory}
        />
      )}
    </div>
  );
}
