import type { Idea, MoodTag } from "./ideas";
import type { QuizAnswers } from "@/db/schema";

export type QuizOption = {
  id: string;
  label: string;
  moods: MoodTag[];
};

export type QuizQuestion = {
  key: keyof QuizAnswers;
  prompt: string;
  options: QuizOption[];
};

export const QUIZ: QuizQuestion[] = [
  {
    key: "movie",
    prompt: "Pick your summer movie aesthetic",
    options: [
      { id: "coastal-grandma", label: "🧺 Coastal Grandma", moods: ["cozy", "romantic", "solo"] },
      { id: "wild-adventure", label: "🪂 Wild Adventure", moods: ["adventurous", "active", "social"] },
      { id: "hot-girl-walk", label: "👟 Hot Girl Walk", moods: ["active", "social", "solo"] },
      { id: "indie-coffee", label: "☕ Indie Coffee Shop", moods: ["cozy", "solo", "romantic"] },
    ],
  },
  {
    key: "fridayNight",
    prompt: "Your ideal Friday night",
    options: [
      { id: "sleepover", label: "🍿 Sleepover with snacks", moods: ["cozy", "social", "lazy"] },
      { id: "concert", label: "🎤 Concert with friends", moods: ["social", "active", "adventurous"] },
      { id: "sunset-hike", label: "🌅 Sunset hike", moods: ["romantic", "active", "solo"] },
      { id: "book-candle", label: "📚 Me + a book + a candle", moods: ["solo", "cozy", "lazy"] },
    ],
  },
  {
    key: "snack",
    prompt: "Pick a snack and that's the whole question",
    options: [
      { id: "watermelon", label: "🍉 Cold watermelon", moods: ["cozy", "lazy"] },
      { id: "spicy-chips", label: "🌶 Spicy chips", moods: ["adventurous", "social"] },
      { id: "iced-coffee", label: "🥤 Iced coffee", moods: ["cozy", "solo"] },
      { id: "ice-cream-truck", label: "🍦 Ice cream truck", moods: ["social", "broke"] },
    ],
  },
  {
    key: "soundtrack",
    prompt: "If your summer had a soundtrack",
    options: [
      { id: "pop", label: "💅 Pop girl summer", moods: ["social", "active"] },
      { id: "lofi", label: "🎧 Lo-fi study beats", moods: ["cozy", "solo"] },
      { id: "country", label: "🤠 Country roads", moods: ["solo", "romantic"] },
      { id: "y2k", label: "📼 Y2K throwbacks", moods: ["social", "broke"] },
    ],
  },
  {
    key: "vacation",
    prompt: "Choose a vacation that doesn't exist yet",
    options: [
      { id: "no-signal", label: "🏝 Beach town, no signal", moods: ["solo", "lazy", "romantic"] },
      { id: "cabin-wifi", label: "🌲 Forest cabin (with WiFi)", moods: ["cozy", "solo"] },
      { id: "lake-house", label: "🏠 Cousin's lake-house chaos", moods: ["social", "adventurous"] },
      { id: "hotel-pool", label: "🏊 Hotel pool, city you've never been", moods: ["broke", "lazy"] },
    ],
  },
  {
    key: "sideQuest",
    prompt: "Your summer side quest",
    options: [
      { id: "books", label: "📚 Read 10 books", moods: ["solo", "cozy"] },
      { id: "tan", label: "🌞 Get really tan", moods: ["lazy", "social"] },
      { id: "skill", label: "🛼 Learn one new skill", moods: ["solo", "active", "adventurous"] },
      { id: "friend", label: "🤝 Make a new friend", moods: ["social", "romantic"] },
    ],
  },
  {
    key: "chaos",
    prompt: "Pick a chaotic energy",
    options: [
      { id: "road-trip", label: "🚗 Spontaneous road trip", moods: ["adventurous", "social", "broke"] },
      { id: "picnic", label: "🧺 Aesthetic picnic (3h prep)", moods: ["romantic", "cozy"] },
      { id: "sunrise", label: "🌅 Stay up till sunrise", moods: ["adventurous", "social"] },
      { id: "woods", label: "🌲 Disappear into the woods", moods: ["solo", "adventurous"] },
    ],
  },
];

const ANSWER_INDEX: Map<string, QuizOption> = new Map(
  QUIZ.flatMap((q) => q.options.map((o) => [`${q.key}:${o.id}`, o]))
);

function getMoodsForAnswer(key: keyof QuizAnswers, answerId: string): MoodTag[] {
  return ANSWER_INDEX.get(`${key}:${answerId}`)?.moods ?? [];
}

/** Build a per-mood weight map from the user's answers. */
export function moodProfileFromAnswers(answers: QuizAnswers | null | undefined): Map<MoodTag, number> {
  const profile = new Map<MoodTag, number>();
  if (!answers) return profile;
  for (const q of QUIZ) {
    const answerId = answers[q.key];
    if (typeof answerId !== "string") continue;
    for (const mood of getMoodsForAnswer(q.key, answerId)) {
      profile.set(mood, (profile.get(mood) ?? 0) + 1);
    }
  }
  return profile;
}

/** Score = sum of profile weights for each of the idea's mood tags. */
export function scoreIdea(idea: Idea, profile: Map<MoodTag, number>): number {
  let s = 0;
  for (const m of idea.moods) s += profile.get(m) ?? 0;
  return s;
}

/** Returns ideas sorted by vibe score desc (stable across ties). */
export function sortByVibe(ideas: Idea[], profile: Map<MoodTag, number>): Idea[] {
  return [...ideas]
    .map((i, idx) => ({ i, idx, s: scoreIdea(i, profile) }))
    .sort((a, b) => b.s - a.s || a.idx - b.idx)
    .map((x) => x.i);
}

/** Friendly summary of the user's top 2-3 vibes, e.g. "cozy + solo + social". */
export function describeVibe(profile: Map<MoodTag, number>): string {
  const sorted = [...profile.entries()].sort((a, b) => b[1] - a[1]);
  return sorted.slice(0, 3).map(([m]) => m).join(" · ");
}
