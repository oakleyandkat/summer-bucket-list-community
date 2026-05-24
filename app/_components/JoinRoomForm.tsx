"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { joinRoomAction } from "../_actions/room";

export function JoinRoomForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setError(null);
    setPending(true);
    const result = await joinRoomAction(formData);
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push(`/rooms/${result.data.code}`);
  }

  return (
    <form action={onSubmit} className="space-y-3">
      <label className="block">
        <span className="block text-sm font-bold text-ink-soft">Room code</span>
        <input
          type="text"
          name="code"
          required
          maxLength={6}
          placeholder="ABC123"
          autoComplete="off"
          className="mt-1 w-full rounded-xl border-[3px] border-ink bg-white px-4 py-3 text-2xl font-mono tracking-[0.4em] text-center uppercase text-ink focus:outline-none focus:ring-2 focus:ring-coral"
        />
      </label>
      {error && <p className="text-sm font-bold text-coral-deep">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-2xl border-[3px] border-ink bg-coral px-5 py-3 font-black text-white shadow-chunky-sm transition hover:-translate-y-0.5 disabled:opacity-60"
      >
        {pending ? "Joining…" : "🚪 Join with code"}
      </button>
    </form>
  );
}
