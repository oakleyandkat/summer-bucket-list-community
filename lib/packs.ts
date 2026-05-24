import type { Idea, MoodTag } from "./ideas";

export type PackSlug = "cottagecore" | "beach" | "rainy";

export type Pack = {
  slug: PackSlug;
  name: string;
  emoji: string;
  tagline: string;
  accent: string; // tailwind color name from the project theme
  coinCost: number;
  ideas: Idea[];
};

type RawPackIdea = Omit<Idea, "key" | "category">;

function buildPack(
  slug: PackSlug,
  name: string,
  emoji: string,
  tagline: string,
  accent: string,
  coinCost: number,
  raw: RawPackIdea[]
): Pack {
  return {
    slug,
    name,
    emoji,
    tagline,
    accent,
    coinCost,
    ideas: raw.map((idea, i) => ({
      ...idea,
      key: `p-${slug}-${i}`,
      category: "free" as const, // placeholder; pack ideas don't use canonical categories
    })),
  };
}

export const PACKS: Pack[] = [
  buildPack(
    "cottagecore",
    "Cottagecore",
    "🌾",
    "soft world, sourdough energy, bug landed on your hand",
    "sun",
    50,
    [
      { emoji: "🍯", text: "Make something from scratch with no recipe", moods: ["cozy", "solo"] },
      { emoji: "🌾", text: "Press flowers in a heavy book — leave them a week", moods: ["solo", "cozy", "romantic"] },
      { emoji: "🧺", text: "Hang laundry on a clothesline (or a tree branch)", moods: ["cozy", "lazy", "broke"] },
      { emoji: "🍞", text: "Bake bread and let it cool on the windowsill", moods: ["cozy", "solo", "social"] },
      { emoji: "🦋", text: "Sit still long enough for a bug to land on you", moods: ["lazy", "solo"] },
      { emoji: "🌼", text: "Make a daisy chain (or any-flower chain)", moods: ["broke", "cozy", "romantic"] },
      { emoji: "📖", text: "Read a book on a porch / blanket / hammock", moods: ["lazy", "cozy", "solo"] },
      { emoji: "🐝", text: "Eat your lunch outside under a tree — snack picnic for one", moods: ["solo", "broke", "cozy"] },
    ]
  ),
  buildPack(
    "beach",
    "Beach Day",
    "🌊",
    "sand in everything, sunscreen mustache, perfect",
    "sky",
    50,
    [
      { emoji: "🐚", text: "Collect 5 things from the shore worth keeping", moods: ["solo", "broke", "active"] },
      { emoji: "🏖", text: "Build a sandcastle bigger than a basketball", moods: ["social", "active", "broke"] },
      { emoji: "🌊", text: "Float on your back and just stare up", moods: ["lazy", "solo", "cozy"] },
      { emoji: "🦀", text: "Find a tide pool and look for tiny creatures", moods: ["adventurous", "solo", "active"] },
      { emoji: "🌅", text: "Watch the sun set into water (any water counts)", moods: ["romantic", "solo", "cozy"] },
      { emoji: "🍦", text: "Ice cream while walking the boardwalk", moods: ["social", "romantic", "cozy"] },
      { emoji: "🩴", text: "Walk barefoot for at least 20 minutes", moods: ["lazy", "solo", "broke"] },
      { emoji: "🏄", text: "Try to ride a wave — boogie board counts", moods: ["adventurous", "active", "social"] },
    ]
  ),
  buildPack(
    "rainy",
    "Rainy Indoor",
    "🌧",
    "for when summer is gross outside and you're glad",
    "coral",
    50,
    [
      { emoji: "🍵", text: "Make a fancy hot drink even though it's summer", moods: ["cozy", "solo", "broke"] },
      { emoji: "🎬", text: "Put on a movie you've seen a million times", moods: ["lazy", "cozy", "social"] },
      { emoji: "🧩", text: "Start a puzzle. Finish or don't, your call.", moods: ["solo", "cozy", "lazy"] },
      { emoji: "📓", text: "Write a letter to someone — sending optional", moods: ["solo", "romantic", "cozy"] },
      { emoji: "🛁", text: "Bath or shower in the dark with one candle", moods: ["solo", "cozy", "romantic"] },
      { emoji: "🎨", text: "Doodle the rain on the window", moods: ["solo", "broke", "cozy"] },
      { emoji: "📞", text: "Call someone you've been meaning to call", moods: ["social", "cozy", "solo"] },
      { emoji: "🪟", text: "Sit by the window and watch the storm. No phone.", moods: ["lazy", "solo", "cozy"] },
    ]
  ),
];

export const PACK_BY_SLUG: Record<PackSlug, Pack> = Object.fromEntries(
  PACKS.map((p) => [p.slug, p])
) as Record<PackSlug, Pack>;

export const PACK_IDEA_BY_KEY: Record<string, { pack: Pack; idea: Idea }> =
  Object.fromEntries(
    PACKS.flatMap((p) => p.ideas.map((i) => [i.key, { pack: p, idea: i }]))
  );

export function isPackIdeaKey(key: string): boolean {
  return key.startsWith("p-");
}

export function packSlugFromIdeaKey(key: string): PackSlug | null {
  if (!isPackIdeaKey(key)) return null;
  const parts = key.split("-");
  if (parts.length < 3) return null;
  const slug = parts[1] as PackSlug;
  return slug in PACK_BY_SLUG ? slug : null;
}

// Re-export MoodTag for convenience
export type { MoodTag };
