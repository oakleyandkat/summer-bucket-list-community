"use client";

import { useState, useMemo } from "react";
import { QUIZ } from "@/lib/quiz";
import { saveQuizAction } from "../_actions/quiz";

type Answers = Record<string, string>;

export function QuizForm({ initialAnswers }: { initialAnswers?: Answers }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(initialAnswers ?? {});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const question = QUIZ[step];
  const isLast = step === QUIZ.length - 1;
  const progress = useMemo(
    () => Math.round(((step + 1) / QUIZ.length) * 100),
    [step]
  );

  function pick(optionId: string) {
    const next = { ...answers, [question.key]: optionId };
    setAnswers(next);
    if (!isLast) {
      // Auto-advance for that BuzzFeed-quiz tempo
      setTimeout(() => setStep((s) => Math.min(QUIZ.length - 1, s + 1)), 180);
    }
  }

  async function submit() {
    setError(null);
    setSubmitting(true);
    const fd = new FormData();
    for (const q of QUIZ) {
      const a = answers[q.key];
      if (!a) {
        setError(`You skipped "${q.prompt}".`);
        setSubmitting(false);
        return;
      }
      fd.set(q.key, a);
    }
    const result = await saveQuizAction(fd);
    if (result && "ok" in result && !result.ok) {
      setError(result.error);
      setSubmitting(false);
    }
    // redirect() inside the action takes us home, so no client-side nav needed.
  }

  const selected = answers[question.key];

  return (
    <div className="rounded-[28px] border-[3px] border-ink bg-white p-7 shadow-chunky-lg">
      {/* Progress dots */}
      <div className="mb-2 flex items-center justify-between text-xs font-black text-ink-soft">
        <span>
          Question {step + 1} / {QUIZ.length}
        </span>
        <span>{progress}%</span>
      </div>
      <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-cream">
        <div
          className="h-full bg-gradient-to-r from-sun to-coral transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <h2 className="mb-4 font-display text-2xl sm:text-3xl font-black leading-tight">
        {question.prompt}
      </h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {question.options.map((o) => {
          const active = selected === o.id;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => pick(o.id)}
              className={`rounded-2xl border-[3px] border-ink px-4 py-4 text-left text-base font-bold shadow-chunky-sm transition hover:-translate-y-1 ${
                active ? "bg-sun -translate-y-1" : "bg-white"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>

      {error && <p className="mt-3 text-sm font-bold text-coral-deep">{error}</p>}

      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="text-sm font-bold text-ink-soft underline disabled:opacity-30"
        >
          ← back
        </button>

        {isLast ? (
          <button
            type="button"
            onClick={submit}
            disabled={submitting || !selected}
            className="rounded-2xl border-[3px] border-ink bg-coral px-6 py-3 font-black text-white shadow-chunky-sm transition hover:-translate-y-0.5 disabled:opacity-50"
          >
            {submitting ? "Saving…" : "✨ See my vibe"}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setStep((s) => Math.min(QUIZ.length - 1, s + 1))}
            disabled={!selected}
            className="rounded-2xl border-[3px] border-ink bg-white px-5 py-2 text-sm font-bold text-ink shadow-chunky-sm disabled:opacity-40"
          >
            next →
          </button>
        )}
      </div>
    </div>
  );
}
