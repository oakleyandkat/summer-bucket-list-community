import Link from "next/link";
import { redirect } from "next/navigation";
import { getMyMemories } from "../_actions/memory";
import { getCurrentAccount } from "@/lib/session";
import { IDEA_BY_KEY } from "@/lib/ideas";
import { PACK_IDEA_BY_KEY, isPackIdeaKey } from "@/lib/packs";

function resolveIdea(key: string) {
  if (isPackIdeaKey(key)) return PACK_IDEA_BY_KEY[key]?.idea;
  return IDEA_BY_KEY[key];
}

function formatDate(d: Date) {
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function MemoriesPage() {
  const me = await getCurrentAccount();
  if (!me) redirect("/");

  const rows = await getMyMemories();

  return (
    <main className="relative z-10 mx-auto w-full max-w-[1080px] px-6 pt-12 pb-20 sm:pt-16">
      <header className="mb-8 text-center">
        <div className="mb-3 inline-block -rotate-2 rounded-full bg-coral px-3.5 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-white">
          🌅 {me.name}&apos;s memory book
        </div>
        <h1 className="font-display text-[clamp(2.2rem,5.5vw,3.8rem)] font-black leading-none tracking-[-0.02em]">
          The{" "}
          <span className="inline-block -rotate-2 rounded-2xl bg-sun px-3.5 pb-1 shadow-chunky-sm">
            summer
          </span>{" "}
          so far
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-[1.05rem] text-ink-soft">
          Every idea you&apos;ve checked off, with a photo. Comes back stronger
          every time you do another one.
        </p>
      </header>

      <div className="mb-8 flex flex-wrap items-center justify-center gap-2 text-sm">
        <Link
          href="/"
          className="rounded-full border-2 border-ink bg-white px-4 py-1.5 font-black text-ink shadow-chunky-sm transition hover:-translate-y-0.5"
        >
          ← back to the list
        </Link>
        <span className="rounded-full border-2 border-ink bg-cream px-4 py-1.5 font-black text-ink shadow-chunky-sm">
          {rows.length} {rows.length === 1 ? "memory" : "memories"}
        </span>
      </div>

      {rows.length === 0 ? (
        <section className="mx-auto max-w-md rounded-[28px] border-[3px] border-dashed border-ink bg-white/60 p-8 text-center shadow-chunky-sm">
          <div className="text-5xl">📷</div>
          <h2 className="mt-3 font-display text-2xl font-black">
            no memories yet
          </h2>
          <p className="mt-2 text-sm font-bold text-ink-soft">
            Check off an idea on the home page, then tap{" "}
            <span className="rounded-md bg-cream px-1.5 py-0.5">📷 add a photo</span>{" "}
            to start your scrapbook.
          </p>
          <Link
            href="/"
            className="mt-5 inline-block rounded-xl border-[3px] border-ink bg-sun px-4 py-2 text-sm font-black text-ink shadow-chunky-sm transition hover:-translate-y-0.5"
          >
            Go pick something
          </Link>
        </section>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((m) => {
            const idea = resolveIdea(m.ideaKey);
            return (
              <article
                key={m.ideaKey}
                className="overflow-hidden rounded-2xl border-[3px] border-ink bg-white shadow-chunky-sm transition hover:-translate-y-1 hover:-rotate-[0.5deg]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.photo}
                  alt={idea?.text ?? "memory"}
                  className="aspect-square w-full border-b-[3px] border-ink object-cover"
                />
                <div className="p-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl leading-none" aria-hidden>
                      {idea?.emoji ?? "✨"}
                    </span>
                    <span className="text-[0.95rem] font-bold text-ink leading-tight">
                      {idea?.text ?? m.ideaKey}
                    </span>
                  </div>
                  {m.caption && (
                    <p className="mt-2 rounded-lg bg-cream px-2.5 py-1.5 text-[0.85rem] font-bold italic text-ink">
                      &ldquo;{m.caption}&rdquo;
                    </p>
                  )}
                  <div className="mt-3 text-[0.7rem] font-black uppercase tracking-wider text-ink-soft">
                    {formatDate(m.createdAt)}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
