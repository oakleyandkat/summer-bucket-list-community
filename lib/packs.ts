import type { Idea, MoodTag } from "./ideas";

// Pack slug is just a string at this point — the canonical PACK_BY_SLUG lookup
// is the runtime source of truth. Keeping it loose makes adding/editing packs
// in this file cheap.
export type PackSlug = string;

export type Pack = {
  slug: PackSlug;
  name: string;
  emoji: string;
  tagline: string;
  accent: "sun" | "coral" | "sky" | "grass";
  coinCost: number;
  ideas: Idea[];
};

type RawPackIdea = Omit<Idea, "key" | "category">;

function buildPack(
  slug: PackSlug,
  name: string,
  emoji: string,
  tagline: string,
  accent: Pack["accent"],
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
      category: "free" as const,
    })),
  };
}

export const PACKS: Pack[] = [
  // ─────────────────────────────────────────────────────────────────────
  // AESTHETIC PACKS
  // ─────────────────────────────────────────────────────────────────────

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
    "soft-girl",
    "Soft girl",
    "🌸",
    "pink everything, pretty fork, in your feelings",
    "coral",
    50,
    [
      { emoji: "🌸", text: "Buy yourself flowers. Put them where you'll see them.", moods: ["solo", "romantic", "cozy"] },
      { emoji: "🧴", text: "Do a 5-step skincare routine for a whole week", moods: ["solo", "cozy"] },
      { emoji: "🍰", text: "Eat dessert with the prettiest fork in the house", moods: ["cozy", "solo"] },
      { emoji: "🧁", text: "Bake something cute — cupcakes, cookies in shapes", moods: ["cozy", "social"] },
      { emoji: "🪞", text: "Take a getting-ready video even if no one ever sees it", moods: ["solo", "lazy"] },
      { emoji: "🎀", text: "Wear ribbons in your hair for a whole day", moods: ["solo", "romantic"] },
      { emoji: "🍑", text: "Make a playlist called 'girl in her feelings summer'", moods: ["solo", "romantic", "cozy"] },
      { emoji: "💌", text: "Write yourself a love letter — read it in 6 months", moods: ["solo", "romantic"] },
    ]
  ),

  buildPack(
    "mermaidcore",
    "Mermaidcore",
    "🧜",
    "salt hair, blue everything, just float",
    "sky",
    50,
    [
      { emoji: "🧜", text: "Swim somewhere with your hair down and let it tangle", moods: ["adventurous", "solo"] },
      { emoji: "🐚", text: "Make jewelry from shells you found yourself", moods: ["solo", "broke", "active"] },
      { emoji: "🌊", text: "Float on your back for at least 10 minutes straight", moods: ["lazy", "solo", "cozy"] },
      { emoji: "🦪", text: "Try a seafood you've never had before", moods: ["adventurous", "social"] },
      { emoji: "🧴", text: "Use a scent that smells like saltwater all week", moods: ["solo", "cozy"] },
      { emoji: "🪞", text: "Sea-spray your hair and don't fix it for the day", moods: ["solo", "lazy"] },
      { emoji: "💧", text: "Take a bath with something floating in it (flowers, oils)", moods: ["solo", "cozy", "romantic"] },
      { emoji: "🐋", text: "Watch a documentary about something that lives underwater", moods: ["lazy", "cozy", "solo"] },
    ]
  ),

  buildPack(
    "y2k",
    "Y2K",
    "💿",
    "butterfly clips, burned CDs, omg ttyl",
    "coral",
    50,
    [
      { emoji: "💿", text: "Burn a CD or curated playlist for a friend (or yourself)", moods: ["social", "solo", "broke"] },
      { emoji: "📼", text: "Watch a movie made before you were born — way before", moods: ["lazy", "cozy", "solo"] },
      { emoji: "🦋", text: "Wear butterfly clips for a whole day, unironically", moods: ["solo", "social"] },
      { emoji: "📱", text: "Text someone using only y2k chatspeak (omg, ttyl, lol)", moods: ["social", "broke"] },
      { emoji: "🎞", text: "Take photos with a real disposable camera — no peeking", moods: ["social", "solo", "broke"] },
      { emoji: "💋", text: "Make a friendship bracelet that says something on it", moods: ["solo", "social", "cozy"] },
      { emoji: "🛼", text: "Find roller skates, even if it's just down the driveway", moods: ["active", "broke"] },
      { emoji: "🦄", text: "Bedazzle one thing you own that doesn't need it at all", moods: ["solo", "broke"] },
    ]
  ),

  buildPack(
    "dark-academia",
    "Dark academia",
    "📚",
    "old books, candle wax, smart in a soft way",
    "sky",
    75,
    [
      { emoji: "📚", text: "Read a book you'd be embarrassed to admit you haven't", moods: ["solo", "cozy"] },
      { emoji: "🕯", text: "Light a candle and write something by hand", moods: ["solo", "cozy"] },
      { emoji: "🏛", text: "Visit a library you've never been to — even just to walk it", moods: ["solo", "broke", "adventurous"] },
      { emoji: "✒️", text: "Learn one word in a language you don't speak", moods: ["solo", "broke"] },
      { emoji: "🦉", text: "Pull an all-nighter to finish something you started", moods: ["solo"] },
      { emoji: "☕", text: "Order a coffee you can't pronounce, journal somewhere old", moods: ["solo", "cozy"] },
      { emoji: "🗝", text: "Find a hidden corner of your school / town you've never noticed", moods: ["solo", "adventurous"] },
      { emoji: "📜", text: "Memorize a poem. Four lines counts. Recite it to a mirror.", moods: ["solo"] },
    ]
  ),

  buildPack(
    "whimsigoth",
    "Whimsigoth",
    "🌙",
    "moon water, witchy, dramatic, fun",
    "coral",
    75,
    [
      { emoji: "🌙", text: "Stay up to watch the moon at its brightest", moods: ["solo", "romantic"] },
      { emoji: "🔮", text: "Get a deck of tarot cards and pull one every morning", moods: ["solo", "cozy"] },
      { emoji: "🕸", text: "Wear all black on the hottest day of summer", moods: ["solo", "social"] },
      { emoji: "🦇", text: "Spot a bat at dusk. Or settle for hearing one.", moods: ["adventurous", "solo"] },
      { emoji: "🕯", text: "Light candles for dinner, even if it's just cereal", moods: ["solo", "cozy", "romantic"] },
      { emoji: "🪦", text: "Walk through an old cemetery during the day (respectfully)", moods: ["solo", "adventurous"] },
      { emoji: "🌿", text: "Make a small herb bundle to hang somewhere", moods: ["solo", "cozy"] },
      { emoji: "📕", text: "Read your horoscope, then write a better one", moods: ["solo"] },
    ]
  ),

  buildPack(
    "coastal-grandma",
    "Coastal grandma",
    "🥖",
    "wicker, iced tea, linen, slow",
    "sun",
    50,
    [
      { emoji: "🥖", text: "Make a snack plate — crackers, cheese, olives, the works", moods: ["cozy", "social", "solo"] },
      { emoji: "🧺", text: "Pack a basket and eat lunch somewhere with a view", moods: ["cozy", "romantic", "social"] },
      { emoji: "🪴", text: "Buy or borrow one houseplant. Don't kill it.", moods: ["solo", "cozy"] },
      { emoji: "☕", text: "Make iced tea from scratch (not from a powder)", moods: ["cozy", "solo"] },
      { emoji: "📻", text: "Listen to NPR or jazz on a porch", moods: ["lazy", "cozy", "solo"] },
      { emoji: "🛏", text: "Make your bed look like a hotel bed for one day", moods: ["solo", "cozy"] },
      { emoji: "🧦", text: "Wear something linen. Cuff the sleeves. Untuck halfway.", moods: ["lazy", "cozy", "solo"] },
      { emoji: "🍋", text: "Squeeze fresh lemonade and drink it slowly", moods: ["cozy", "solo", "broke"] },
    ]
  ),

  buildPack(
    "goblincore",
    "Goblincore",
    "🍄",
    "mushroom, snail, pocket rock, glorious",
    "grass",
    30,
    [
      { emoji: "🍄", text: "Find three mushrooms growing in the wild. Do not eat them.", moods: ["adventurous", "solo"] },
      { emoji: "🪨", text: "Start a rock collection. Carry one in your pocket all summer.", moods: ["solo", "broke", "cozy"] },
      { emoji: "🐌", text: "Catch a snail, name it, release it", moods: ["solo", "cozy"] },
      { emoji: "🌿", text: "Forage one thing you know is safe (mint, blackberries)", moods: ["adventurous", "broke", "solo"] },
      { emoji: "🦎", text: "Spot a lizard. Just spot it. That's the whole quest.", moods: ["adventurous", "solo"] },
      { emoji: "🍂", text: "Press a leaf inside a heavy book", moods: ["solo", "cozy", "broke"] },
      { emoji: "🪺", text: "Find a feather and figure out what bird it's from", moods: ["solo", "adventurous"] },
      { emoji: "🐛", text: "Watch a bug do its whole bug life for at least 5 minutes", moods: ["lazy", "solo"] },
    ]
  ),

  // ─────────────────────────────────────────────────────────────────────
  // TIME-OF-DAY / SEASON PACKS
  // ─────────────────────────────────────────────────────────────────────

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

  buildPack(
    "sunrise-club",
    "Sunrise club",
    "🌄",
    "ungodly hour, suspicious peace, smug all day",
    "sun",
    75,
    [
      { emoji: "🌄", text: "Get up before the sun, just because", moods: ["solo", "active"] },
      { emoji: "☕", text: "Make breakfast in actual daylight for once", moods: ["solo", "cozy"] },
      { emoji: "🐦", text: "Sit and listen to the birds wake up", moods: ["lazy", "solo", "cozy"] },
      { emoji: "🚶", text: "Walk somewhere before anyone else is awake", moods: ["solo", "active"] },
      { emoji: "📸", text: "Take a photo at the exact moment the sun crests", moods: ["solo", "active"] },
      { emoji: "🥯", text: "Buy a fresh pastry as soon as the shop opens", moods: ["solo", "cozy"] },
      { emoji: "🧎", text: "Watch a sunrise from somewhere you've never seen one", moods: ["solo", "adventurous", "romantic"] },
      { emoji: "🌅", text: "Stay outside until morning feels different from night", moods: ["solo", "cozy"] },
    ]
  ),

  buildPack(
    "late-night",
    "Late night",
    "🌃",
    "between 11pm and 3am, when everything's weirder",
    "sky",
    50,
    [
      { emoji: "🌃", text: "Do something productive between 11pm and 1am", moods: ["solo"] },
      { emoji: "🚗", text: "Take a midnight drive with no one around", moods: ["solo", "adventurous", "romantic"] },
      { emoji: "🍟", text: "Get food from a drive-thru after 10pm", moods: ["lazy", "social", "broke"] },
      { emoji: "📞", text: "Call someone you wouldn't normally call at night", moods: ["social"] },
      { emoji: "🌌", text: "Sit outside in the dark for 20 minutes with no phone", moods: ["lazy", "solo", "cozy"] },
      { emoji: "🍿", text: "Watch a movie that starts past midnight", moods: ["lazy", "cozy"] },
      { emoji: "✏️", text: "Write something only night-you would write", moods: ["solo", "romantic"] },
      { emoji: "🔦", text: "Take a flashlight walk in your own neighborhood after dark", moods: ["adventurous", "solo"] },
    ]
  ),

  buildPack(
    "golden-hour",
    "Golden hour",
    "🌇",
    "that hour. the one. you know.",
    "sun",
    30,
    [
      { emoji: "🌇", text: "Be outside during the hour before sunset", moods: ["lazy", "solo", "romantic"] },
      { emoji: "📷", text: "Take a photo of yourself in golden hour light", moods: ["solo", "romantic"] },
      { emoji: "🌾", text: "Walk through a field at golden hour", moods: ["solo", "romantic", "active"] },
      { emoji: "🍹", text: "Drink something cold while everything is gold", moods: ["lazy", "cozy", "solo"] },
      { emoji: "🪟", text: "Open every window in your house at sunset", moods: ["lazy", "cozy", "solo"] },
      { emoji: "🪞", text: "Look at yourself in golden light. You glow.", moods: ["solo", "romantic"] },
      { emoji: "🎶", text: "Pick one song to play during golden hour all week", moods: ["solo", "romantic"] },
      { emoji: "👯", text: "Watch a sunset with someone, in silence", moods: ["romantic", "social", "cozy"] },
    ]
  ),

  buildPack(
    "heatwave",
    "Heatwave",
    "🥵",
    "it's gross out, lean in",
    "coral",
    30,
    [
      { emoji: "🥵", text: "Survive a day when it's too hot, on purpose", moods: ["adventurous", "solo"] },
      { emoji: "🧊", text: "Make ice pops from juice or coffee", moods: ["solo", "cozy", "broke"] },
      { emoji: "🛁", text: "Take a cold shower fully dressed (then change)", moods: ["solo"] },
      { emoji: "🚿", text: "Run through a sprinkler. Yes, again. You can do this.", moods: ["active", "social", "broke"] },
      { emoji: "🍉", text: "Eat half a watermelon by yourself", moods: ["lazy", "solo", "broke"] },
      { emoji: "🪭", text: "Find a hand fan. Use it dramatically.", moods: ["solo", "social"] },
      { emoji: "🌳", text: "Find the coldest shady spot near you and claim it", moods: ["lazy", "solo", "broke"] },
      { emoji: "❄️", text: "Visit a place specifically because it has AC", moods: ["lazy", "solo", "social"] },
    ]
  ),

  // ─────────────────────────────────────────────────────────────────────
  // ACTIVITY PACKS
  // ─────────────────────────────────────────────────────────────────────

  buildPack(
    "music",
    "Music",
    "🎧",
    "headphones in, world out, vibes up",
    "coral",
    50,
    [
      { emoji: "🎧", text: "Make a playlist exactly the length of one shower", moods: ["solo", "cozy"] },
      { emoji: "🎤", text: "Sing a whole song out loud, alone, no embarrassment", moods: ["solo"] },
      { emoji: "🎸", text: "Learn four chords of one song on something", moods: ["solo"] },
      { emoji: "💿", text: "Buy a physical album. Listen front to back.", moods: ["solo", "cozy"] },
      { emoji: "🪗", text: "Go to live music — even just open mic at a coffee shop", moods: ["social", "broke"] },
      { emoji: "🥁", text: "Drum on something that isn't a drum for a whole song", moods: ["solo", "broke"] },
      { emoji: "📻", text: "Listen to a full radio show on a station you'd never pick", moods: ["solo", "adventurous"] },
      { emoji: "🎼", text: "Find your favorite song from 5 years ago. Sit with the feels.", moods: ["solo", "romantic"] },
    ]
  ),

  buildPack(
    "photo-dump",
    "Photo dump",
    "📸",
    "document everything, post nothing",
    "sun",
    50,
    [
      { emoji: "📸", text: "Take a photo every hour for a whole day", moods: ["solo"] },
      { emoji: "📷", text: "Use only film or a disposable for one full day", moods: ["solo", "broke"] },
      { emoji: "🤳", text: "Take a self-portrait that's not for posting anywhere", moods: ["solo", "romantic"] },
      { emoji: "🪟", text: "Photograph the same view at sunrise, noon, and sunset", moods: ["solo"] },
      { emoji: "🖼", text: "Print one photo and put it on your wall", moods: ["solo", "cozy"] },
      { emoji: "🌐", text: "Make a photo collage from prints (CVS prints count)", moods: ["solo", "broke", "cozy"] },
      { emoji: "🎞", text: "Photograph your hands doing your favorite task", moods: ["solo"] },
      { emoji: "👯", text: "Stage a real photo shoot with a friend, however silly", moods: ["social"] },
    ]
  ),

  buildPack(
    "crafty",
    "Crafty",
    "🧵",
    "make something with your hands. ugly counts.",
    "coral",
    50,
    [
      { emoji: "🧵", text: "Make a friendship bracelet for an actual friend", moods: ["solo", "social", "cozy"] },
      { emoji: "🧶", text: "Knit or crochet one row. That's it. One row.", moods: ["solo", "cozy"] },
      { emoji: "🖼", text: "Frame something. Even a magazine page. Looks expensive.", moods: ["solo", "broke", "cozy"] },
      { emoji: "✂️", text: "Cut a t-shirt into something else (crop, bag, scrunchie)", moods: ["solo", "broke"] },
      { emoji: "🪡", text: "Sew a button back on something you've been avoiding", moods: ["solo", "broke"] },
      { emoji: "🎨", text: "Paint a tiny canvas. Tiny canvas. No pressure.", moods: ["solo", "cozy"] },
      { emoji: "📒", text: "Make a zine. 8 pages. Whatever's on your mind.", moods: ["solo", "broke"] },
      { emoji: "🪩", text: "Decoupage something with stuff from a magazine", moods: ["solo", "broke", "cozy"] },
    ]
  ),

  buildPack(
    "bookworm",
    "Bookworm",
    "📖",
    "read more this summer than you said you would",
    "sky",
    50,
    [
      { emoji: "📖", text: "Finish a book in one sitting", moods: ["solo", "lazy", "cozy"] },
      { emoji: "📚", text: "Read a book by an author you've never heard of", moods: ["solo", "adventurous"] },
      { emoji: "🪑", text: "Read at the same coffee shop for at least an hour", moods: ["solo", "cozy"] },
      { emoji: "💌", text: "Annotate a book — write in the margins like a maniac", moods: ["solo"] },
      { emoji: "🎧", text: "Listen to an audiobook on a long walk", moods: ["solo", "active"] },
      { emoji: "📝", text: "Write a one-paragraph review of a book you read", moods: ["solo"] },
      { emoji: "🧎", text: "Read outside, on the ground, like a real kid", moods: ["lazy", "solo", "cozy"] },
      { emoji: "🎭", text: "Read a play out loud, doing all the voices", moods: ["solo", "social"] },
    ]
  ),

  buildPack(
    "movie-marathon",
    "Movie marathon",
    "🎬",
    "three movies, one day, no apologies",
    "coral",
    50,
    [
      { emoji: "🎬", text: "Watch three movies in one day. Same director or theme.", moods: ["lazy", "cozy", "social"] },
      { emoji: "🍿", text: "Make real popcorn (stovetop, not microwave)", moods: ["cozy", "solo"] },
      { emoji: "🚗", text: "Find a drive-in or outdoor movie screening", moods: ["social", "romantic"] },
      { emoji: "🎞", text: "Watch a black-and-white movie all the way through", moods: ["solo", "cozy"] },
      { emoji: "📺", text: "Watch a movie your parents loved when they were your age", moods: ["social", "cozy"] },
      { emoji: "🎭", text: "Watch a movie in a genre you'd never pick", moods: ["solo", "adventurous"] },
      { emoji: "🍫", text: "Make a custom movie snack — your own concession", moods: ["solo", "cozy"] },
      { emoji: "🎟", text: "Go to a movie alone. No phone the whole time.", moods: ["solo", "adventurous"] },
    ]
  ),

  buildPack(
    "kitchen",
    "Kitchen experiments",
    "🍳",
    "cook things you've never cooked",
    "sun",
    50,
    [
      { emoji: "🍳", text: "Cook something from scratch for someone in your family", moods: ["social", "cozy"] },
      { emoji: "🥗", text: "Make a meal using only one pan or pot", moods: ["solo", "cozy"] },
      { emoji: "🍰", text: "Bake a cake even if it ends up ugly", moods: ["solo", "cozy", "social"] },
      { emoji: "🌶", text: "Try a spice you've never used before", moods: ["solo", "adventurous"] },
      { emoji: "🧂", text: "Learn how to fix a too-salty thing (look it up, you can do it)", moods: ["solo"] },
      { emoji: "🍅", text: "Cook with one ingredient from a farmers market", moods: ["solo", "broke", "adventurous"] },
      { emoji: "🥘", text: "Make breakfast for dinner at least once this summer", moods: ["lazy", "cozy", "broke"] },
      { emoji: "🥟", text: "Try a recipe in a language you don't speak (translate as you go)", moods: ["solo", "adventurous"] },
    ]
  ),

  buildPack(
    "plant-parent",
    "Plant parent",
    "🌱",
    "small green friend, big responsibility",
    "grass",
    30,
    [
      { emoji: "🌱", text: "Grow something from a seed (basil counts)", moods: ["solo", "cozy", "broke"] },
      { emoji: "🪴", text: "Repot a plant that's outgrown its home", moods: ["solo", "cozy"] },
      { emoji: "🌻", text: "Plant flowers somewhere they can actually grow", moods: ["solo", "broke"] },
      { emoji: "💧", text: "Keep a plant alive for the whole summer", moods: ["solo"] },
      { emoji: "🍅", text: "Grow one edible thing in a pot or yard", moods: ["solo", "broke"] },
      { emoji: "🌿", text: "Take a cutting from a houseplant and root it in water", moods: ["solo", "cozy", "broke"] },
      { emoji: "🪻", text: "Learn the actual name of a plant you walk past daily", moods: ["solo", "broke"] },
      { emoji: "🐌", text: "Make a bug-friendly corner of the yard (rocks, water, plants)", moods: ["solo", "cozy"] },
    ]
  ),

  // ─────────────────────────────────────────────────────────────────────
  // PLACE PACKS
  // ─────────────────────────────────────────────────────────────────────

  buildPack(
    "pool-day",
    "Pool day",
    "🏊",
    "chlorine forever, sunscreen lines, no regrets",
    "sky",
    30,
    [
      { emoji: "🏊", text: "Swim laps until you can't (count them, brag)", moods: ["active", "solo"] },
      { emoji: "🌊", text: "Cannonball off the deep end like an athlete", moods: ["active", "social"] },
      { emoji: "🐬", text: "Learn one new pool trick (handstand, dive, somersault)", moods: ["active", "social"] },
      { emoji: "🧴", text: "Apply sunscreen properly and don't get burned. ONCE.", moods: ["solo"] },
      { emoji: "🍦", text: "Eat poolside snacks like it's a job", moods: ["lazy", "cozy", "social"] },
      { emoji: "📚", text: "Read on a pool float for 20 min without falling in", moods: ["lazy", "solo", "cozy"] },
      { emoji: "🤿", text: "Open your eyes underwater (chlorine warriors only)", moods: ["adventurous", "active"] },
      { emoji: "👯", text: "Play Marco Polo with at least 3 people", moods: ["social", "active"] },
    ]
  ),

  buildPack(
    "road-trip",
    "Road trip",
    "🚙",
    "no destination, gas station snacks, the BEST playlist",
    "sky",
    75,
    [
      { emoji: "🚙", text: "Take a drive with no destination, just vibes", moods: ["adventurous", "social", "solo"] },
      { emoji: "⛽", text: "Buy a weird snack from a gas station you've never been to", moods: ["adventurous", "broke", "social"] },
      { emoji: "🗺", text: "Pull over for any sign that says 'view'", moods: ["adventurous", "solo"] },
      { emoji: "🎶", text: "Make a road trip playlist exactly the right length", moods: ["solo", "social"] },
      { emoji: "🏨", text: "Stay overnight somewhere with a parent (motel, cabin, anywhere)", moods: ["adventurous", "social"] },
      { emoji: "📸", text: "Take a photo at a state / county / town line", moods: ["adventurous", "social"] },
      { emoji: "🍔", text: "Eat at a restaurant only locals would know", moods: ["social", "adventurous"] },
      { emoji: "🎟", text: "Visit one tourist trap, unironically", moods: ["adventurous", "social"] },
    ]
  ),

  buildPack(
    "city-explorer",
    "City explorer",
    "🏙",
    "ride the bus to the end, learn one new street",
    "grass",
    50,
    [
      { emoji: "🏙", text: "Visit a neighborhood you've never spent time in", moods: ["adventurous", "solo", "social"] },
      { emoji: "🚇", text: "Take public transit to a stop you've never used", moods: ["adventurous", "broke", "solo"] },
      { emoji: "🏛", text: "Go inside one big building you always walk past", moods: ["adventurous", "solo"] },
      { emoji: "🍜", text: "Eat lunch alone at a counter somewhere busy", moods: ["solo", "adventurous"] },
      { emoji: "🎨", text: "Find a piece of public art and learn the story behind it", moods: ["solo", "broke"] },
      { emoji: "🪦", text: "Visit the oldest cemetery in town (respectful walking only)", moods: ["solo", "adventurous"] },
      { emoji: "🛕", text: "Visit a place of worship you don't normally go (respectfully, during open hours)", moods: ["solo", "adventurous"] },
      { emoji: "🚶", text: "Walk a full mile downtown — pick a direction and go", moods: ["solo", "active", "broke"] },
    ]
  ),

  buildPack(
    "hometown",
    "Hometown rediscovered",
    "🏡",
    "your own backyard, on purpose this time",
    "grass",
    30,
    [
      { emoji: "🏡", text: "Visit the place you spent the most time as a little kid", moods: ["solo", "cozy", "romantic"] },
      { emoji: "🎢", text: "Go back to a place you used to think was huge", moods: ["solo", "romantic"] },
      { emoji: "🍦", text: "Order the same thing you always ordered at a place that's still there", moods: ["cozy", "solo", "romantic"] },
      { emoji: "📷", text: "Take a photo of your childhood home (even if you don't live there now)", moods: ["solo", "romantic"] },
      { emoji: "🏫", text: "Walk through your old school grounds when it's empty", moods: ["solo", "romantic"] },
      { emoji: "🌳", text: "Climb a tree you used to climb", moods: ["solo", "active", "romantic"] },
      { emoji: "🛝", text: "Use a piece of playground equipment for a real amount of time", moods: ["solo", "social", "active"] },
      { emoji: "📚", text: "Visit the library you grew up going to", moods: ["solo", "cozy", "romantic"] },
    ]
  ),

  buildPack(
    "amusement",
    "Amusement park",
    "🎡",
    "fair food, scream until your throat hurts",
    "sun",
    100,
    [
      { emoji: "🎡", text: "Ride a ferris wheel and take a photo from the top", moods: ["social", "romantic"] },
      { emoji: "🎢", text: "Ride a roller coaster you're a little scared of", moods: ["adventurous", "social"] },
      { emoji: "🎯", text: "Win a prize from a game booth (or lose dramatically)", moods: ["social", "broke"] },
      { emoji: "🍿", text: "Eat ridiculous fair food (funnel cake, corndog, lemonade)", moods: ["social", "cozy"] },
      { emoji: "🎠", text: "Ride a carousel un-ironically", moods: ["lazy", "social", "romantic"] },
      { emoji: "🤡", text: "Take a silly photo at a photo booth", moods: ["social"] },
      { emoji: "🥇", text: "Try to beat the high score on an arcade game", moods: ["social", "active"] },
      { emoji: "🌃", text: "Stay until the lights come on at the park", moods: ["social", "romantic", "cozy"] },
    ]
  ),

  buildPack(
    "front-porch",
    "Front porch",
    "🪑",
    "sit. drink something. that's the whole thing.",
    "sun",
    30,
    [
      { emoji: "🪑", text: "Sit on a porch with a drink and nothing else for 30 min", moods: ["lazy", "solo", "cozy"] },
      { emoji: "👋", text: "Wave at every person who walks by. Even just one.", moods: ["solo", "social"] },
      { emoji: "🐕", text: "Pet at least one dog that's being walked", moods: ["social", "cozy"] },
      { emoji: "🍋", text: "Run a lemonade stand. Or pretend to.", moods: ["social", "broke"] },
      { emoji: "☔", text: "Sit on the porch during a rainstorm and don't go inside", moods: ["solo", "cozy"] },
      { emoji: "🎺", text: "Play music outside loud enough that someone says something", moods: ["solo", "broke"] },
      { emoji: "📞", text: "Have a long phone call entirely on a porch", moods: ["social", "lazy"] },
      { emoji: "🌅", text: "Watch the sunset from the same spot two days in a row", moods: ["lazy", "solo", "cozy"] },
    ]
  ),

  // ─────────────────────────────────────────────────────────────────────
  // INTENTION / SOCIAL PACKS
  // ─────────────────────────────────────────────────────────────────────

  buildPack(
    "sleepover",
    "Sleepover",
    "🛏",
    "2am chaos, sugar crash, you'll talk about it forever",
    "coral",
    50,
    [
      { emoji: "🛏", text: "Build a fort with every blanket in the house", moods: ["social", "cozy"] },
      { emoji: "🍿", text: "Stay up past 2am watching something nobody else likes", moods: ["social", "lazy"] },
      { emoji: "📔", text: "Write each other letters to open in 5 years", moods: ["social", "romantic"] },
      { emoji: "🎤", text: "Do karaoke at full volume after parents are asleep (sorry parents)", moods: ["social", "active"] },
      { emoji: "💆", text: "Give each other makeovers. Commit fully.", moods: ["social"] },
      { emoji: "🍕", text: "Order food at midnight", moods: ["social", "lazy"] },
      { emoji: "💌", text: "Make a friendship contract, sign it, frame it", moods: ["social", "romantic"] },
      { emoji: "🌌", text: "Go outside in pajamas to look at the stars", moods: ["social", "cozy"] },
    ]
  ),

  buildPack(
    "strangers",
    "Strangers",
    "👋",
    "kindness to people you'll never see again",
    "grass",
    50,
    [
      { emoji: "👋", text: "Compliment a stranger sincerely. Move on. Don't make it weird.", moods: ["social", "solo"] },
      { emoji: "☕", text: "Pay for the next person's coffee. Anonymously if possible.", moods: ["social"] },
      { emoji: "📱", text: "Ask someone to take your photo, then take theirs back", moods: ["social", "adventurous"] },
      { emoji: "🙋", text: "Strike up a real conversation with someone in line", moods: ["social", "adventurous"] },
      { emoji: "🎁", text: "Leave a $5 bill in a library book (with a nice note)", moods: ["social"] },
      { emoji: "🐶", text: "Ask if you can pet someone's dog. ALWAYS ASK FIRST.", moods: ["social", "cozy"] },
      { emoji: "🌷", text: "Hand someone a flower you picked. No reason.", moods: ["social", "romantic"] },
      { emoji: "✉️", text: "Write a thank-you note to someone at a place you go a lot", moods: ["social", "solo"] },
    ]
  ),

  buildPack(
    "side-hustle",
    "Side hustle",
    "💵",
    "make a few summer dollars, on purpose",
    "grass",
    75,
    [
      { emoji: "💵", text: "Make $1 from something you sold or did", moods: ["solo", "adventurous"] },
      { emoji: "🧺", text: "Sell something you don't need anymore", moods: ["solo", "broke"] },
      { emoji: "🍰", text: "Bake or make something to sell to one person", moods: ["solo", "social"] },
      { emoji: "🐕", text: "Walk a neighbor's dog (with permission, obviously)", moods: ["social", "active"] },
      { emoji: "🌿", text: "Pull weeds for $5 from a parent or neighbor", moods: ["active", "broke"] },
      { emoji: "🎨", text: "Make a piece of art and offer to trade for something", moods: ["solo", "social"] },
      { emoji: "📦", text: "Sort everything in one drawer and find $3", moods: ["solo", "broke"] },
      { emoji: "💰", text: "Make a plan for what to do with the money — write it down", moods: ["solo"] },
    ]
  ),

  buildPack(
    "volunteer",
    "Volunteer",
    "💛",
    "give a little time, feel different about your day",
    "grass",
    50,
    [
      { emoji: "💛", text: "Spend one hour helping at a place you don't get paid", moods: ["social", "active"] },
      { emoji: "🐱", text: "Volunteer at an animal shelter (call first, they need help)", moods: ["social", "cozy"] },
      { emoji: "🌳", text: "Pick up trash in one specific spot for 20 min", moods: ["solo", "active", "broke"] },
      { emoji: "📚", text: "Help shelve books / organize at a library", moods: ["solo", "cozy"] },
      { emoji: "🥫", text: "Donate something usable to a food drive", moods: ["solo", "social"] },
      { emoji: "🧓", text: "Visit someone older than 70 who'd love the company", moods: ["social", "cozy"] },
      { emoji: "🌱", text: "Help with someone's garden for free", moods: ["social", "active"] },
      { emoji: "✉️", text: "Write a card to a stranger who's having a hard time", moods: ["solo", "social"] },
    ]
  ),

  buildPack(
    "anti-screen",
    "Anti-screen",
    "📵",
    "phone in a drawer, brain back online",
    "grass",
    30,
    [
      { emoji: "📵", text: "Go an entire day without your phone (in a drawer, off)", moods: ["solo"] },
      { emoji: "📖", text: "Read an actual paper book for an hour with no devices", moods: ["solo", "cozy"] },
      { emoji: "📞", text: "Make a real phone call (not a text) to someone older than you", moods: ["social"] },
      { emoji: "✉️", text: "Write a letter and mail it. Stamps and everything.", moods: ["solo", "broke"] },
      { emoji: "🗺", text: "Use a paper map to find somewhere new (no GPS)", moods: ["adventurous", "solo"] },
      { emoji: "🍳", text: "Cook a meal with no recipe pulled up on your phone", moods: ["solo"] },
      { emoji: "🛏", text: "Don't take your phone to bed for one week", moods: ["solo"] },
      { emoji: "📔", text: "Journal by hand for 3 days in a row", moods: ["solo", "cozy"] },
    ]
  ),

  buildPack(
    "memory-makers",
    "Memory makers",
    "✨",
    "things you'll still remember in 10 years",
    "sun",
    100,
    [
      { emoji: "✨", text: "Do one thing this summer you'll talk about in 10 years", moods: ["adventurous", "social"] },
      { emoji: "📸", text: "Take a 'this is the summer I…' photo", moods: ["solo", "social"] },
      { emoji: "🎤", text: "Voice memo yourself describing today, then save it", moods: ["solo"] },
      { emoji: "💌", text: "Write a letter to your future self about right now", moods: ["solo", "romantic"] },
      { emoji: "🏷", text: "Save a ticket, wristband, or scrap from a real day", moods: ["solo", "social"] },
      { emoji: "📔", text: "Make a one-page summer diary every Sunday", moods: ["solo", "cozy"] },
      { emoji: "👯", text: "Have a moment with a friend that requires no phone", moods: ["social", "romantic"] },
      { emoji: "🏆", text: "Pick the favorite day of your summer — celebrate it small", moods: ["solo", "social", "cozy"] },
    ]
  ),
];

export const PACK_BY_SLUG: Record<string, Pack> = Object.fromEntries(
  PACKS.map((p) => [p.slug, p])
);

export const PACK_IDEA_BY_KEY: Record<string, { pack: Pack; idea: Idea }> =
  Object.fromEntries(
    PACKS.flatMap((p) => p.ideas.map((i) => [i.key, { pack: p, idea: i }]))
  );

export function isPackIdeaKey(key: string): boolean {
  return key.startsWith("p-");
}

export function packSlugFromIdeaKey(key: string): PackSlug | null {
  if (!isPackIdeaKey(key)) return null;
  // pack slug can itself contain hyphens (e.g. "dark-academia"), and the
  // final hyphen-segment is the numeric idea index — so re-derive the slug
  // by checking against PACK_BY_SLUG rather than naively splitting.
  for (const slug of Object.keys(PACK_BY_SLUG)) {
    if (key.startsWith(`p-${slug}-`)) return slug;
  }
  return null;
}

export type { MoodTag };
