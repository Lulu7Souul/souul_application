// Lulu Emoji Library
// Used for the reward accessory picker during child profile setup.
// Each emoji has a warm Lulu quote — shown when that accessory is earned.
// Age range: 2–10. Quotes are short, warm, never overwhelming.

export interface EmojiEntry {
  emoji: string
  quote: string      // What Lulu says when this emoji is earned as a reward
  category: string
}

export const EMOJI_LIBRARY: EmojiEntry[] = [
  // ── Animals ──────────────────────────────────────────────────────────
  { emoji: '🐶', quote: 'Your dog is so proud of you!',            category: 'Animals' },
  { emoji: '🐱', quote: 'Your cat is purring with pride!',          category: 'Animals' },
  { emoji: '🐰', quote: 'Your bunny is hopping with joy!',          category: 'Animals' },
  { emoji: '🦊', quote: 'Your fox thinks you are brilliant!',        category: 'Animals' },
  { emoji: '🐻', quote: 'Your bear gives you the biggest hug!',     category: 'Animals' },
  { emoji: '🐼', quote: 'Your panda is beaming!',                   category: 'Animals' },
  { emoji: '🐨', quote: 'Your koala is very proud of you!',         category: 'Animals' },
  { emoji: '🐯', quote: 'Your tiger is roaring for you!',           category: 'Animals' },
  { emoji: '🦁', quote: 'The lion says you are so brave!',          category: 'Animals' },
  { emoji: '🐮', quote: 'Your cow says well done!',                 category: 'Animals' },
  { emoji: '🐷', quote: 'Your piggy is oinking with pride!',        category: 'Animals' },
  { emoji: '🐸', quote: 'Your frog thinks you are wonderful!',      category: 'Animals' },
  { emoji: '🐵', quote: 'Your monkey is swinging for joy!',         category: 'Animals' },
  { emoji: '🐧', quote: 'Your penguin is waddling with happiness!', category: 'Animals' },
  { emoji: '🦆', quote: 'Your duck is quacking well done!',         category: 'Animals' },
  { emoji: '🦉', quote: 'Your wise owl is proud of you!',           category: 'Animals' },
  { emoji: '🦋', quote: 'Your butterfly is dancing just for you!',  category: 'Animals' },
  { emoji: '🐝', quote: 'Your bee has been busy, just like you!',   category: 'Animals' },
  { emoji: '🐢', quote: 'Your tortoise says you did it!',           category: 'Animals' },
  { emoji: '🦄', quote: 'Your unicorn thinks you are magical!',     category: 'Animals' },
  { emoji: '🐉', quote: 'Your dragon is breathing stars for you!',  category: 'Animals' },
  { emoji: '🦕', quote: 'Your dinosaur stomps with pride!',         category: 'Animals' },
  { emoji: '🦖', quote: 'Roar! Your T-Rex thinks you are awesome!', category: 'Animals' },
  { emoji: '🐙', quote: 'Your octopus gives you eight big hugs!',   category: 'Animals' },
  { emoji: '🐬', quote: 'Your dolphin is leaping for joy!',         category: 'Animals' },
  { emoji: '🦈', quote: 'Your shark thinks you are fin-tastic!',    category: 'Animals' },
  { emoji: '🐳', quote: 'Your whale is splashing with happiness!',  category: 'Animals' },
  { emoji: '🦒', quote: 'Your giraffe can see how great you are!',  category: 'Animals' },
  { emoji: '🐘', quote: 'Your elephant never forgets how well you did!', category: 'Animals' },
  { emoji: '🦓', quote: 'Your zebra thinks you are amazing!',       category: 'Animals' },
  { emoji: '🦘', quote: 'Your kangaroo is jumping for joy!',        category: 'Animals' },
  { emoji: '🐓', quote: 'Your rooster is crowing — well done!',     category: 'Animals' },
  { emoji: '🦩', quote: 'Your flamingo is standing tall for you!',  category: 'Animals' },
  { emoji: '🦜', quote: 'Your parrot says: well done, well done!',  category: 'Animals' },
  { emoji: '🐇', quote: 'Your rabbit thinks you are wonderful!',    category: 'Animals' },
  { emoji: '🦔', quote: 'Your hedgehog gives a prickly proud hug!', category: 'Animals' },
  { emoji: '🐿️', quote: 'Your squirrel saved the best for you!',   category: 'Animals' },

  // ── Nature & Magic ───────────────────────────────────────────────────
  { emoji: '🌈', quote: 'You made a rainbow today!',                category: 'Nature' },
  { emoji: '⭐', quote: 'A star shines just for you!',              category: 'Nature' },
  { emoji: '🌟', quote: 'You are glowing — well done!',             category: 'Nature' },
  { emoji: '✨', quote: 'Sparkles everywhere — you did it!',         category: 'Nature' },
  { emoji: '🌸', quote: 'A blossom blooms just for you!',           category: 'Nature' },
  { emoji: '🌺', quote: 'A beautiful flower — just like you!',      category: 'Nature' },
  { emoji: '🌻', quote: 'A sunflower grows for you!',               category: 'Nature' },
  { emoji: '🌹', quote: 'A rose for someone wonderful!',            category: 'Nature' },
  { emoji: '🌼', quote: 'A daisy — fresh and bright, like you!',    category: 'Nature' },
  { emoji: '🍀', quote: 'A lucky clover for a lucky you!',          category: 'Nature' },
  { emoji: '🌙', quote: 'The moon smiles at you tonight!',          category: 'Nature' },
  { emoji: '☀️', quote: 'The sun is beaming with pride!',           category: 'Nature' },
  { emoji: '❄️', quote: 'A snowflake — special, just like you!',    category: 'Nature' },
  { emoji: '🌊', quote: 'A wave cheers just for you!',              category: 'Nature' },
  { emoji: '🔥', quote: 'You are on fire — well done!',             category: 'Nature' },
  { emoji: '🌈', quote: 'You made a rainbow today!',                category: 'Nature' },
  { emoji: '🍁', quote: 'A beautiful leaf falls just for you!',     category: 'Nature' },
  { emoji: '🌲', quote: 'Strong like a tree — that is you!',        category: 'Nature' },
  { emoji: '🌴', quote: 'Swaying with happiness for you!',          category: 'Nature' },

  // ── Space ────────────────────────────────────────────────────────────
  { emoji: '🚀', quote: 'You are rocketing through your day!',      category: 'Space'  },
  { emoji: '🪐', quote: 'You are out of this world!',               category: 'Space'  },
  { emoji: '🛸', quote: 'Mission complete — well done, astronaut!', category: 'Space'  },
  { emoji: '🌠', quote: 'A shooting star just for you!',            category: 'Space'  },
  { emoji: '🔭', quote: 'You are a star explorer!',                 category: 'Space'  },

  // ── Food & Treats ────────────────────────────────────────────────────
  { emoji: '🍕', quote: 'Pizza party — you earned it!',             category: 'Treats' },
  { emoji: '🍦', quote: 'An ice cream scoop for doing so well!',    category: 'Treats' },
  { emoji: '🍩', quote: 'A doughnut for a superstar!',              category: 'Treats' },
  { emoji: '🍪', quote: 'A freshly baked cookie just for you!',     category: 'Treats' },
  { emoji: '🎂', quote: 'Today deserves a celebration!',            category: 'Treats' },
  { emoji: '🍓', quote: 'Sweet as a strawberry — just like you!',   category: 'Treats' },
  { emoji: '🍭', quote: 'A lolly for working so hard!',             category: 'Treats' },
  { emoji: '🧁', quote: 'A cupcake for a wonderful you!',           category: 'Treats' },
  { emoji: '🍰', quote: 'A slice of cake — you deserve it!',        category: 'Treats' },
  { emoji: '🍫', quote: 'Sweet work — a chocolate just for you!',   category: 'Treats' },
  { emoji: '🍬', quote: 'Sweet, sweet, sweet — just like you!',     category: 'Treats' },
  { emoji: '🍒', quote: 'Cherry on top — because you did it!',      category: 'Treats' },
  { emoji: '🍉', quote: 'Cool as a watermelon — well done!',        category: 'Treats' },
  { emoji: '🍇', quote: 'A whole bunch of well done for you!',      category: 'Treats' },

  // ── Sports & Play ────────────────────────────────────────────────────
  { emoji: '⚽', quote: 'Goal! You scored today!',                  category: 'Play'   },
  { emoji: '🏆', quote: 'You are a champion!',                      category: 'Play'   },
  { emoji: '🥇', quote: 'Gold medal — you are number one!',         category: 'Play'   },
  { emoji: '🎯', quote: 'Bullseye — you hit your goal!',            category: 'Play'   },
  { emoji: '🎮', quote: 'Level up — you are a star!',               category: 'Play'   },
  { emoji: '🎨', quote: 'You are a true artist!',                   category: 'Play'   },
  { emoji: '🎵', quote: 'Your day sounds like a beautiful song!',   category: 'Play'   },
  { emoji: '🎸', quote: 'Rock star — that is you!',                 category: 'Play'   },
  { emoji: '🎺', quote: 'Ta-da! You did it!',                       category: 'Play'   },
  { emoji: '🥁', quote: 'Drumroll please — well done!',             category: 'Play'   },
  { emoji: '🧩', quote: 'You are a piece of something wonderful!',  category: 'Play'   },
  { emoji: '🪁', quote: 'You aimed high — and got there!',         category: 'Play'   },
  { emoji: '🎈', quote: 'Up, up, up — you are on your way!',       category: 'Play'   },
  { emoji: '🎁', quote: 'You are the best gift of all!',            category: 'Play'   },
  { emoji: '🎉', quote: 'Celebration time — you did it!',           category: 'Play'   },

  // ── Transport ────────────────────────────────────────────────────────
  { emoji: '🚗', quote: 'Vroom vroom — you are going places!',      category: 'Transport' },
  { emoji: '✈️', quote: 'You are flying high today!',               category: 'Transport' },
  { emoji: '🚂', quote: 'Full steam ahead — well done!',            category: 'Transport' },
  { emoji: '🚁', quote: 'You are soaring above and beyond!',        category: 'Transport' },
  { emoji: '⛵', quote: 'Sailing smoothly — just like you!',        category: 'Transport' },
  { emoji: '🚒', quote: 'Nee-naw! Super-hero alert!',               category: 'Transport' },
  { emoji: '🏎️', quote: 'Fast and brilliant — that is you!',       category: 'Transport' },
  { emoji: '🚀', quote: 'Blasting off — you did it!',               category: 'Transport' },
]

export const EMOJI_CATEGORIES = [
  'Animals', 'Nature', 'Space', 'Treats', 'Play', 'Transport',
] as const

export const EMOJI_BY_CATEGORY = EMOJI_CATEGORIES.reduce(
  (acc, cat) => {
    acc[cat] = EMOJI_LIBRARY.filter(e => e.category === cat)
    return acc
  },
  {} as Record<string, EmojiEntry[]>
)

// Get the quote for a chosen emoji — falls back to a warm generic
export function getEmojiQuote(emoji: string): string {
  const entry = EMOJI_LIBRARY.find(e => e.emoji === emoji)
  return entry?.quote ?? `${emoji} — you earned it today!`
}

// Default 5 accessories if parent skips the picker
export const DEFAULT_ACCESSORIES = ['⭐', '🎀', '✨', '🌈', '👑']
