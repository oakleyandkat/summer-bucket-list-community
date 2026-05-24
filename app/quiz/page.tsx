import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentAccount } from "@/lib/session";
import { QuizForm } from "../_components/QuizForm";

export default async function QuizPage() {
  const me = await getCurrentAccount();
  if (!me) redirect("/");

  // Pass existing answers in case they want to change one
  const initial = (me.quizAnswers ?? {}) as Record<string, string>;

  return (
    <main className="relative z-10 mx-auto w-full max-w-2xl px-6 pt-10 pb-20">
      <div className="mb-4 flex items-center justify-between text-sm">
        <Link href="/" className="font-bold text-ink-soft underline hover:text-coral">
          ← skip for now
        </Link>
        <span className="text-ink-soft">Hey {me.name}</span>
      </div>

      <header className="mb-6 text-center">
        <div className="mb-3 inline-block -rotate-2 rounded-full bg-ink px-3.5 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-cream">
          ✨ Vibe check ✨
        </div>
        <h1 className="font-display text-[clamp(2rem,5vw,3rem)] font-black leading-none">
          What kind of summer{" "}
          <span className="inline-block -rotate-2 rounded-xl bg-coral px-2 pb-1 text-white shadow-chunky-sm">
            are you?
          </span>
        </h1>
        <p className="mx-auto mt-3 max-w-md text-[1rem] text-ink-soft">
          7 quick questions. No wrong answers. We&apos;ll tilt the list toward stuff that actually sounds good to you.
        </p>
      </header>

      <QuizForm initialAnswers={initial} />
    </main>
  );
}
