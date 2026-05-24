// Calls the Claude API to generate a custom bucket-list idea matching the
// user's vibe profile. Falls back to a clearly-marked mock response if no
// ANTHROPIC_API_KEY is set, so local dev (and pre-production deploys) keep
// working without a key.

import type { QuizAnswers } from "@/db/schema";
import { moodProfileFromAnswers } from "./quiz";

const MODEL = "claude-haiku-4-5-20251001";
const API_URL = "https://api.anthropic.com/v1/messages";

const SYSTEM_PROMPT = `You are the dream-summer-idea generator for an app called "Summer Bucket List." Your job: invent ONE single bucket-list idea, fresh, never generic.

Constraints:
- The idea is a single short action a teenager can do during summer.
- Tone: chunky, playful, kind. Short imperative sentence. Like: "Watch a sunrise — at least once. Set the alarm." or "Borrow a fishing rod from someone. Catch nothing. Sit there anyway."
- Avoid clichés ("go for a walk," "read a book") unless paired with a twist.
- Don't moralize. Don't suggest drugs/alcohol. Don't recommend dangerous things.
- Match the user's vibe profile when given (lazy, social, broke, adventurous, solo, romantic, active, cozy).

Output strict JSON only, no prose, no markdown fences. Schema:
{ "emoji": "<single emoji>", "text": "<the idea, max 80 chars>" }`;

export type AiSuggestion = {
  emoji: string;
  text: string;
  source: "claude" | "mock";
};

const MOCK_POOL: { emoji: string; text: string }[] = [
  { emoji: "🌒", text: "Stay up until you can name three constellations" },
  { emoji: "🥨", text: "Bake something with a recipe written by a stranger online" },
  { emoji: "🚌", text: "Take the bus to the end of its line, then walk back to anywhere familiar" },
  { emoji: "🪴", text: "Steal a clipping from a houseplant. Try to grow it." },
  { emoji: "🎙", text: "Record a voice memo of summer sounds — birds, ice cubes, a screen door" },
  { emoji: "🥭", text: "Eat a fruit you can't pronounce. Look up where it grows after." },
  { emoji: "🛼", text: "Find the closest hill and roll something down it" },
  { emoji: "🌒", text: "Watch the moon rise instead of the sun. Set the alarm at the weirder end of the day." },
];

function pickMock(): AiSuggestion {
  const pick = MOCK_POOL[Math.floor(Math.random() * MOCK_POOL.length)];
  return { ...pick, source: "mock" };
}

export async function suggestIdea(
  quizAnswers: QuizAnswers | null | undefined
): Promise<AiSuggestion> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return pickMock();

  const profile = moodProfileFromAnswers(quizAnswers ?? undefined);
  const userVibes = [...profile.keys()].slice(0, 4).join(", ") || "anything";

  const userMessage = `User's vibe profile (most-to-least): ${userVibes}.
Generate one idea now. JSON only.`;

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 200,
        system: [
          {
            type: "text",
            text: SYSTEM_PROMPT,
            cache_control: { type: "ephemeral" },
          },
        ],
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!res.ok) {
      console.error("Claude API error:", res.status, await res.text());
      return pickMock();
    }

    const data = (await res.json()) as {
      content: { type: string; text?: string }[];
    };
    const text = data.content?.find((c) => c.type === "text")?.text;
    if (!text) return pickMock();

    // The model is told to output strict JSON. Strip any accidental fences.
    const cleaned = text.trim().replace(/^```json\s*|\s*```$/g, "");
    const parsed = JSON.parse(cleaned) as { emoji?: string; text?: string };
    if (!parsed.emoji || !parsed.text) return pickMock();

    return {
      emoji: parsed.emoji,
      text: parsed.text.slice(0, 120),
      source: "claude",
    };
  } catch (err) {
    console.error("Claude API call failed:", err);
    return pickMock();
  }
}
