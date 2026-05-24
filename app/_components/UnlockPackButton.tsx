"use client";

import { useState, useTransition } from "react";
import { unlockPackAction } from "../_actions/pack";

export function UnlockPackButton({
  slug,
  cost,
  affordable,
}: {
  slug: string;
  cost: number;
  affordable: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onClick() {
    setError(null);
    startTransition(async () => {
      const result = await unlockPackAction(slug);
      if ("error" in result) setError(result.error);
    });
  }

  if (!affordable) {
    return (
      <button
        type="button"
        disabled
        className="w-full cursor-not-allowed rounded-xl border-[3px] border-ink bg-cream px-4 py-2.5 text-sm font-black text-ink-soft opacity-70"
      >
        need {cost} 🪙
      </button>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        className="w-full rounded-xl border-[3px] border-ink bg-sun px-4 py-2.5 text-sm font-black text-ink shadow-chunky-sm transition hover:-translate-y-0.5 hover:rotate-[-0.5deg] disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? "unlocking…" : `Unlock (${cost} 🪙)`}
      </button>
      {error && (
        <p className="mt-2 rounded-lg border-2 border-coral bg-coral/10 px-2 py-1 text-xs font-bold text-coral">
          {error}
        </p>
      )}
    </div>
  );
}
