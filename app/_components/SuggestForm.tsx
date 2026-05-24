"use client";

import { useState } from "react";
import { suggestIdeaAction } from "../_actions/room";

const EMOJIS = ["✨", "🌞", "🌊", "🍉", "🏕", "🎤", "🎲", "🛼", "🍦", "🪩", "📷", "🥏"];

export function SuggestForm({ roomId }: { roomId: string }) {
  const [emoji, setEmoji] = useState("✨");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [open, setOpen] = useState(false);

  async function onSubmit(formData: FormData) {
    formData.set("emoji", emoji);
    setError(null);
    setPending(true);
    const result = await suggestIdeaAction(roomId, formData);
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    // Reset and stay open in case they want to add another
    (document.getElementById("suggest-text") as HTMLInputElement | null)?.focus();
    const form = document.getElementById("suggest-form") as HTMLFormElement | null;
    form?.reset();
    setEmoji("✨");
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-2xl border-[3px] border-dashed border-ink bg-white/70 px-5 py-4 text-base font-bold text-ink-soft hover:bg-white"
      >
        ➕ Suggest something for the group
      </button>
    );
  }

  return (
    <form
      id="suggest-form"
      action={onSubmit}
      className="space-y-3 rounded-2xl border-[3px] border-ink bg-white p-5 shadow-chunky-sm"
    >
      <h3 className="font-display text-lg font-black">➕ Add a group idea</h3>
      <div>
        <div className="mb-1 text-sm font-bold text-ink-soft">Pick an emoji</div>
        <div className="flex flex-wrap gap-1.5">
          {EMOJIS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setEmoji(e)}
              className={`h-9 w-9 rounded-lg border-2 border-ink text-lg transition ${
                emoji === e ? "-translate-y-0.5 bg-sun" : "bg-white hover:bg-cream"
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>
      <label className="block">
        <span className="block text-sm font-bold text-ink-soft">The thing to do</span>
        <input
          id="suggest-text"
          type="text"
          name="text"
          required
          maxLength={200}
          placeholder="e.g. Drive to the lake at sunset and bring snacks"
          className="mt-1 w-full rounded-xl border-[3px] border-ink bg-white px-4 py-3 text-base text-ink focus:outline-none focus:ring-2 focus:ring-coral"
        />
      </label>
      {error && <p className="text-sm font-bold text-coral-deep">{error}</p>}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-2xl border-[3px] border-ink bg-grass px-5 py-2.5 font-black text-ink shadow-chunky-sm transition hover:-translate-y-0.5 disabled:opacity-60"
        >
          {pending ? "Adding…" : "Add it"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-sm text-ink-soft underline"
        >
          cancel
        </button>
      </div>
    </form>
  );
}
