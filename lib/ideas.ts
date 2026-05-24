export type MoodTag =
  | "lazy"
  | "social"
  | "broke"
  | "adventurous"
  | "solo"
  | "romantic"
  | "active"
  | "cozy";

export type CategoryId =
  | "outdoors"
  | "foodie"
  | "social"
  | "cozy"
  | "adventurous"
  | "creative"
  | "free";

export type Idea = {
  key: string; // stable id, e.g. "c-0"
  emoji: string;
  text: string;
  category: CategoryId;
  moods: MoodTag[];
};

export type Category = {
  id: CategoryId;
  name: string;
  emoji: string;
  desc: string;
};

export type Mood = {
  id: MoodTag;
  emoji: string;
  label: string;
};

export const CATEGORIES: Category[] = [
  { id: "outdoors", name: "Out there", emoji: "🌳", desc: "Touch some grass." },
  { id: "foodie", name: "Eat it", emoji: "🍑", desc: "Summer tastes like something. Find it." },
  { id: "social", name: "With people", emoji: "🤝", desc: "Bring a friend. Or three." },
  { id: "cozy", name: "Slow & cozy", emoji: "🛋", desc: "Not every day is a quest." },
  { id: "adventurous", name: "Mild adventure", emoji: "🗺", desc: "A little chaos, not too much." },
  { id: "creative", name: "Make something", emoji: "🎨", desc: "Doesn't have to be good." },
  { id: "free", name: "Free / broke", emoji: "💸", desc: "Costs $0. Or basically." },
];

export const MOODS: Mood[] = [
  { id: "lazy", emoji: "🛌", label: "Lazy" },
  { id: "social", emoji: "🎉", label: "Social" },
  { id: "broke", emoji: "💸", label: "Broke" },
  { id: "adventurous", emoji: "🧗", label: "Adventurous" },
  { id: "solo", emoji: "🙋", label: "Solo" },
  { id: "romantic", emoji: "💛", label: "Romantic" },
  { id: "active", emoji: "🏃", label: "Active" },
  { id: "cozy", emoji: "☕", label: "Cozy" },
];

const RAW: Omit<Idea, "key">[] = [
  // OUTDOORS
  { emoji: "🌅", text: "Watch a sunrise — at least once. Set the alarm.", category: "outdoors", moods: ["solo", "romantic", "active"] },
  { emoji: "🏊", text: "Find a swimmable body of water you've never been to", category: "outdoors", moods: ["adventurous", "social", "active"] },
  { emoji: "🚲", text: "Bike somewhere you'd normally drive", category: "outdoors", moods: ["active", "broke", "solo"] },
  { emoji: "🏕", text: "Sleep outside one night (backyard counts)", category: "outdoors", moods: ["adventurous", "cozy", "broke"] },
  { emoji: "🌳", text: "Pack a picnic and eat it under an actual tree", category: "outdoors", moods: ["romantic", "broke", "cozy"] },
  { emoji: "🥾", text: "Hike a trail that's exactly one new-to-you", category: "outdoors", moods: ["active", "adventurous", "solo"] },
  { emoji: "🎣", text: "Borrow a fishing rod from someone. Catch nothing. Sit there anyway.", category: "outdoors", moods: ["lazy", "solo", "cozy"] },
  { emoji: "🪁", text: "Fly a kite. It is harder than you remember.", category: "outdoors", moods: ["social", "broke", "active"] },
  { emoji: "🛶", text: "Rent a kayak, paddleboard, or canoe for one hour", category: "outdoors", moods: ["active", "adventurous", "social"] },
  { emoji: "🌌", text: "Drive somewhere dark and watch the stars", category: "outdoors", moods: ["romantic", "solo", "cozy"] },
  { emoji: "⛰", text: "Climb something tall enough to make your legs hurt tomorrow", category: "outdoors", moods: ["active", "adventurous"] },
  { emoji: "🌊", text: "Get to a beach. Any beach. Even a lake beach.", category: "outdoors", moods: ["lazy", "social", "romantic"] },

  // FOODIE
  { emoji: "🍦", text: "Eat ice cream from three different shops in one week", category: "foodie", moods: ["social", "cozy"] },
  { emoji: "🍑", text: "Buy a fruit you've never tried before", category: "foodie", moods: ["broke", "solo", "adventurous"] },
  { emoji: "🌽", text: "Go to a farmers market and buy something on instinct", category: "foodie", moods: ["solo", "social", "broke"] },
  { emoji: "🍉", text: "Have a watermelon-eating contest. No utensils.", category: "foodie", moods: ["social", "broke"] },
  { emoji: "🍕", text: "Eat a meal outside that you'd normally eat inside", category: "foodie", moods: ["lazy", "broke", "romantic"] },
  { emoji: "🧊", text: "Make popsicles from scratch (juice + a freezer = done)", category: "foodie", moods: ["cozy", "broke", "solo"] },
  { emoji: "🌮", text: "Try a food truck you keep meaning to try", category: "foodie", moods: ["solo", "social", "broke"] },
  { emoji: "🍓", text: "Go to a pick-your-own berry/fruit farm", category: "foodie", moods: ["social", "romantic", "active"] },
  { emoji: "🔥", text: "Make s'mores. Even on a stovetop. They count.", category: "foodie", moods: ["cozy", "social", "broke"] },
  { emoji: "🥤", text: "Order something you can't pronounce off a menu", category: "foodie", moods: ["adventurous", "solo", "social"] },

  // SOCIAL
  { emoji: "🎤", text: "Karaoke. With friends or completely alone in the car.", category: "social", moods: ["social", "solo", "active"] },
  { emoji: "🎳", text: "Bowling. Lose loudly.", category: "social", moods: ["social", "broke", "cozy"] },
  { emoji: "🌮", text: "Throw a low-effort dinner — everyone brings one thing", category: "social", moods: ["social", "broke", "cozy"] },
  { emoji: "🎬", text: "Host a backyard / living-room movie night", category: "social", moods: ["social", "cozy", "romantic"] },
  { emoji: "🎟", text: "Buy tickets to a tiny local show you've never heard of", category: "social", moods: ["adventurous", "social", "romantic"] },
  { emoji: "🥏", text: "Frisbee in a park. Just frisbee. That's the whole event.", category: "social", moods: ["broke", "active", "social"] },
  { emoji: "👯", text: "Reconnect with one friend you haven't seen in over a year", category: "social", moods: ["solo", "social", "cozy"] },
  { emoji: "🍻", text: "Try a new bar/cafe with someone — somewhere neither of you has been", category: "social", moods: ["social", "romantic", "adventurous"] },
  { emoji: "🎲", text: "Game night. Pick the dumbest game you own.", category: "social", moods: ["cozy", "social", "broke"] },
  { emoji: "💃", text: "Go dancing. Even if you don't dance.", category: "social", moods: ["social", "adventurous", "active"] },

  // COZY / LAZY
  { emoji: "📚", text: "Read a whole book outside in one sitting", category: "cozy", moods: ["lazy", "solo", "cozy"] },
  { emoji: "🛏", text: "Take a nap in a hammock or on a porch", category: "cozy", moods: ["lazy", "cozy", "solo"] },
  { emoji: "🎧", text: "Make a summer playlist. Use it relentlessly.", category: "cozy", moods: ["lazy", "solo", "romantic"] },
  { emoji: "☕", text: "Have iced coffee at a cafe and people-watch for an hour", category: "cozy", moods: ["lazy", "solo", "broke"] },
  { emoji: "🪟", text: "Open every window. Don't turn on the AC for one whole evening.", category: "cozy", moods: ["lazy", "cozy", "broke"] },
  { emoji: "🎨", text: "Watercolor something badly. The badness is the point.", category: "cozy", moods: ["solo", "cozy", "broke"] },
  { emoji: "📓", text: "Journal three pages of nonsense in a cafe", category: "cozy", moods: ["solo", "cozy", "broke"] },
  { emoji: "🛁", text: "Take a cold shower mid-afternoon for no reason", category: "cozy", moods: ["lazy", "solo"] },

  // ADVENTUROUS
  { emoji: "🚂", text: "Take a day trip to a town you've never been to", category: "adventurous", moods: ["adventurous", "solo", "romantic"] },
  { emoji: "🗺", text: "Open a map and go to the nearest place you've never visited", category: "adventurous", moods: ["adventurous", "solo", "broke"] },
  { emoji: "🏛", text: "Visit a tiny weird museum (the smaller, the better)", category: "adventurous", moods: ["solo", "romantic", "broke"] },
  { emoji: "🌋", text: "Learn one new skill — juggling, skateboarding, cartwheels, anything", category: "adventurous", moods: ["solo", "active", "adventurous"] },
  { emoji: "🚌", text: "Take public transit to the end of a line you've never ridden", category: "adventurous", moods: ["solo", "broke", "adventurous"] },
  { emoji: "🪂", text: "Do one thing that legit scares you a little", category: "adventurous", moods: ["adventurous", "active", "solo"] },
  { emoji: "🚪", text: "Yes-day: say yes to everything for one (reasonable) day", category: "adventurous", moods: ["adventurous", "social", "solo"] },
  { emoji: "🧭", text: "No-phone walk: leave it home, walk somewhere for 90 minutes", category: "adventurous", moods: ["solo", "active", "broke"] },

  // CREATIVE
  { emoji: "📸", text: "Shoot a roll/phone reel of just one color all summer", category: "creative", moods: ["solo", "cozy", "broke"] },
  { emoji: "🌻", text: "Press a flower in a heavy book. Forget about it. Find it in October.", category: "creative", moods: ["solo", "cozy", "broke"] },
  { emoji: "🍳", text: "Cook one recipe from a country you've never visited", category: "creative", moods: ["solo", "cozy", "social"] },
  { emoji: "🎸", text: "Learn the chords to one song you love", category: "creative", moods: ["solo", "cozy"] },
  { emoji: "✉️", text: "Write a real letter. Mail it. With a stamp and everything.", category: "creative", moods: ["solo", "romantic", "cozy"] },
  { emoji: "🖼", text: "Make one piece of art and hang it somewhere only you see it", category: "creative", moods: ["solo", "cozy", "broke"] },
  { emoji: "🎥", text: "Film a 30-second 'summer recap' video on your phone", category: "creative", moods: ["solo", "social"] },
  { emoji: "🪴", text: "Grow one (1) plant. Even basil counts.", category: "creative", moods: ["solo", "cozy", "broke"] },

  // FREE / CHEAP
  { emoji: "💸", text: "Library day: get a card, leave with 5 books, owe nothing", category: "free", moods: ["broke", "solo", "cozy"] },
  { emoji: "🌃", text: "Late-night drive with windows down and music loud", category: "free", moods: ["broke", "solo", "romantic"] },
  { emoji: "🧺", text: "Garage sale / thrift store hunt with $10 max", category: "free", moods: ["broke", "social", "solo"] },
  { emoji: "💧", text: "Run through a sprinkler. You're not too old.", category: "free", moods: ["broke", "social", "active"] },
  { emoji: "🎆", text: "Find a free outdoor concert / fireworks / festival nearby", category: "free", moods: ["broke", "social", "romantic"] },
  { emoji: "🪙", text: "Take all your loose change to a fountain. Make a wish per coin.", category: "free", moods: ["broke", "solo", "romantic"] },
  { emoji: "🎨", text: "Sidewalk chalk. Even one drawing. Then walk away.", category: "free", moods: ["broke", "cozy", "solo"] },
  { emoji: "🚏", text: "Window-shop a neighborhood you've never walked through", category: "free", moods: ["broke", "solo", "cozy"] },

  // NOSTALGIC / CHILDHOOD (tagged into other categories)
  { emoji: "🍋", text: "Drink lemonade slow on a porch / stoop / front step", category: "cozy", moods: ["lazy", "cozy", "broke"] },
  { emoji: "🐠", text: "Catch fireflies. Release them. Stand there a while.", category: "outdoors", moods: ["cozy", "romantic", "broke"] },
  { emoji: "🎠", text: "Ride a carousel/Ferris wheel as an adult", category: "social", moods: ["romantic", "social", "broke"] },
  { emoji: "🍿", text: "Drive-in or outdoor screening — find one", category: "social", moods: ["romantic", "social", "cozy"] },
  { emoji: "👟", text: "Run through a sprinkler / play in the rain unironically", category: "outdoors", moods: ["active", "broke", "social"] },
  { emoji: "🥧", text: "Bake a pie with whatever fruit is in season", category: "foodie", moods: ["cozy", "solo", "social"] },
  { emoji: "🎈", text: "Stay out past dark with no plan", category: "social", moods: ["lazy", "social", "romantic"] },
  { emoji: "💌", text: "Send a postcard to someone, from wherever you are", category: "creative", moods: ["solo", "romantic", "broke"] },
];

export const IDEAS: Idea[] = RAW.map((idea, i) => ({ ...idea, key: `c-${i}` }));

export const IDEA_BY_KEY: Record<string, Idea> = Object.fromEntries(
  IDEAS.map((i) => [i.key, i])
);

export const CATEGORY_BY_ID: Record<CategoryId, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c])
) as Record<CategoryId, Category>;
