// ─── Mock Word Data ───────────────────────────────────────────────────────────
// Single source of truth for sample words used across FlashCard and My Words page.
// Replace this with real API/DB data later.

export interface WordEntry {
  id: number;
  word: string;
  meaning: string;
  example: string;
  /** Index into the ILLUSTRATIONS array in WordCard */
  illustration: number;
  fav?: boolean;
  done?: boolean;
}

const MOCK_WORDS: WordEntry[] = [
  {
    id: 1,
    word: "Ephemeral",
    meaning: "Lasting for a very short time; transitory.",
    example:
      "The ephemeral beauty of cherry blossoms makes them all the more precious.",
    illustration: 0,
    fav: true,
  },
  {
    id: 2,
    word: "Serendipity",
    meaning: "The occurrence of events by chance in a happy or beneficial way.",
    example:
      "Finding that café was pure serendipity — it became our favourite spot.",
    illustration: 2,
    done: true,
  },
  {
    id: 3,
    word: "Melancholy",
    meaning: "A feeling of pensive sadness with no obvious cause.",
    example:
      "A deep melancholy settled over him as autumn stripped the trees bare.",
    illustration: 1,
  },
  {
    id: 4,
    word: "Eloquent",
    meaning: "Fluent or persuasive in speaking or writing.",
    example: "Her eloquent speech moved the audience to tears.",
    illustration: 3,
    fav: true,
    done: true,
  },
  {
    id: 5,
    word: "Resilient",
    meaning: "Able to withstand or recover quickly from difficult conditions.",
    example:
      "Children are remarkably resilient and can adapt to new environments quickly.",
    illustration: 4,
  },
  {
    id: 6,
    word: "Luminous",
    meaning:
      "Full of or shedding light; bright or shining, especially in the dark.",
    example:
      "The luminous moon cast silver shadows across the quiet forest floor.",
    illustration: 1,
    fav: true,
  },
  {
    id: 7,
    word: "Tenacious",
    meaning:
      "Holding fast; persistent; not easily giving up a position or goal.",
    example: "Her tenacious spirit carried her through years of setbacks.",
    illustration: 0,
    done: true,
  },
  {
    id: 8,
    word: "Ubiquitous",
    meaning: "Present, appearing, or found everywhere at the same time.",
    example: "Smartphones have become ubiquitous in modern society.",
    illustration: 3,
  },
  {
    id: 9,
    word: "Solace",
    meaning: "Comfort or consolation in a time of distress or sadness.",
    example: "She found solace in music whenever life felt overwhelming.",
    illustration: 2,
  },
  {
    id: 10,
    word: "Perspicacious",
    meaning:
      "Having a ready insight into and understanding of things; mentally perceptive and keen.",
    example:
      "A perspicacious investor spotted the trend long before the market reacted.",
    illustration: 4,
    fav: true,
  },
  {
    id: 11,
    word: "Wanderlust",
    meaning: "A strong desire to travel and explore the world.",
    example:
      "Wanderlust pulled her away from her desk and onto the next flight out.",
    illustration: 2,
    done: true,
  },
  {
    id: 12,
    word: "Sanguine",
    meaning: "Optimistic or positive, especially in a difficult situation.",
    example:
      "Despite the setbacks, she remained sanguine about the project's success.",
    illustration: 3,
    fav: true,
  },
  {
    id: 13,
    word: "Laconic",
    meaning: "Using very few words; brief and concise in speech or expression.",
    example:
      "His laconic reply — 'Fine' — told her nothing about how he truly felt.",
    illustration: 0,
  },
  {
    id: 14,
    word: "Ineffable",
    meaning: "Too great or extreme to be expressed or described in words.",
    example:
      "Standing at the summit, she felt an ineffable sense of peace wash over her.",
    illustration: 1,
    fav: true,
  },
  {
    id: 15,
    word: "Ebullient",
    meaning: "Cheerful and full of energy; overflowing with enthusiasm.",
    example:
      "The ebullient crowd erupted into cheers the moment the band took the stage.",
    illustration: 4,
    done: true,
  },
  {
    id: 16,
    word: "Recondite",
    meaning: "Not known by many people; dealing with obscure subject matter.",
    example:
      "His recondite knowledge of medieval alchemy impressed even the professors.",
    illustration: 2,
  },
  {
    id: 17,
    word: "Halcyon",
    meaning:
      "Denoting a period of time in the past that was idyllically happy and peaceful.",
    example: "She often looked back on those halcyon summer days by the lake.",
    illustration: 3,
    fav: true,
    done: true,
  },
  {
    id: 18,
    word: "Insouciant",
    meaning: "Showing a casual lack of concern; carefree and nonchalant.",
    example: "He strolled into the meeting late with an insouciant shrug.",
    illustration: 0,
  },
  {
    id: 19,
    word: "Pulchritudinous",
    meaning: "Having great physical beauty.",
    example:
      "The pulchritudinous landscape of the valley left every traveller speechless.",
    illustration: 1,
  },
  {
    id: 20,
    word: "Capricious",
    meaning: "Given to sudden and unaccountable changes of mood or behaviour.",
    example:
      "The capricious weather ruined their carefully planned outdoor wedding.",
    illustration: 4,
    fav: true,
  },
  {
    id: 21,
    word: "Loquacious",
    meaning: "Tending to talk a great deal; garrulous.",
    example:
      "The loquacious tour guide barely paused for breath throughout the entire walk.",
    illustration: 2,
    done: true,
  },
  {
    id: 22,
    word: "Penumbra",
    meaning:
      "The partly shaded outer region of a shadow; by extension, an area of uncertainty.",
    example:
      "The scandal cast a penumbra of doubt over the entire administration.",
    illustration: 3,
  },
];

export default MOCK_WORDS;
