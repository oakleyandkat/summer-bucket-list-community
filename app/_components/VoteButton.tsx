"use client";

import { useOptimistic, useTransition } from "react";
import { toggleVoteAction } from "../_actions/room";

export function VoteButton({
  roomId,
  ideaKey,
  voted,
  count,
}: {
  roomId: string;
  ideaKey: string;
  voted: boolean;
  count: number;
}) {
  const [pending, startTransition] = useTransition();
  const [state, setState] = useOptimistic({ voted, count });

  function onClick() {
    startTransition(async () => {
      setState({
        voted: !state.voted,
        count: state.count + (state.voted ? -1 : 1),
      });
      await toggleVoteAction(roomId, ideaKey);
    });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      aria-pressed={state.voted}
      className={`flex shrink-0 items-center gap-1.5 rounded-xl border-[3px] border-ink px-3 py-1.5 text-sm font-black shadow-chunky-sm transition hover:-translate-y-0.5 disabled:opacity-60 ${
        state.voted ? "bg-coral text-white" : "bg-white text-ink"
      }`}
    >
      <span aria-hidden>{state.voted ? "💖" : "🤍"}</span>
      <span>{state.count}</span>
    </button>
  );
}
