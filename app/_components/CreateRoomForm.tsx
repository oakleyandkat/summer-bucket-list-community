"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createRoomAction } from "../_actions/room";

export function CreateRoomForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setError(null);
    setPending(true);
    const result = await createRoomAction(formData);
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
        <span className="block text-sm font-bold text-ink-soft">Room name</span>
        <input
          type="text"
          name="name"
          required
          maxLength={40}
          placeholder="e.g. Summer 2026 crew"
          className="mt-1 w-full rounded-xl border-[3px] border-ink bg-white px-4 py-3 text-base text-ink focus:outline-none focus:ring-2 focus:ring-sky"
        />
      </label>
      {error && <p className="text-sm font-bold text-coral-deep">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-2xl border-[3px] border-ink bg-sky px-5 py-3 font-black text-ink shadow-chunky-sm transition hover:-translate-y-0.5 disabled:opacity-60"
      >
        {pending ? "Creating…" : "🏖 Create room"}
      </button>
    </form>
  );
}
