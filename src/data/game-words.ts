export type GameWord = {
  en: string; // "cat"
  word: string; // ድመት
  roman: string; // "dim-met"
  /** syllables in correct order */
  syllables: string[];
  /** extra real words the exact same tiles can form ("that's a word too") */
  also: string[][];
  level: 1 | 2 | 3;
};

import { GENERATED_WORDS } from "./generated-amharic-words";

// Curated from scripts/candidates.json (validated Amharic ↔ English pairs).
// `also` reuses the exact same tile set in a different order — a real word too.
export const WORDS: GameWord[] = [
  {
    en: "fish",
    word: "አሳ",
    roman: "a-sa",
    syllables: ["አ", "ሳ"],
    also: [["ዓ", "ሣ"]],
    level: 1,
  },
  {
    en: "cow",
    word: "ላም",
    roman: "lam",
    syllables: ["ላ", "ም"],
    also: [],
    level: 1,
  },
  {
    en: "bread",
    word: "ዳቦ",
    roman: "da-bo",
    syllables: ["ዳ", "ቦ"],
    also: [],
    level: 1,
  },
  {
    en: "milk",
    word: "ወተት",
    roman: "we-tet",
    syllables: ["ወ", "ተ", "ት"],
    also: [],
    level: 1,
  },
  {
    en: "bird",
    word: "ወፍ",
    roman: "wef",
    syllables: ["ወ", "ፍ"],
    also: [],
    level: 1,
  },
  {
    en: "mouth",
    word: "አፍ",
    roman: "af",
    syllables: ["አ", "ፍ"],
    also: [],
    level: 1,
  },
  {
    en: "sheep",
    word: "በግ",
    roman: "beg",
    syllables: ["በ", "ግ"],
    also: [],
    level: 1,
  },
  {
    en: "door",
    word: "በር",
    roman: "ber",
    syllables: ["በ", "ር"],
    also: [],
    level: 1,
  },
  {
    en: "yellow",
    word: "ብጫ",
    roman: "bi-cha",
    syllables: ["ብ", "ጫ"],
    also: [],
    level: 2,
  },
  {
    en: "red",
    word: "ቀይ",
    roman: "kay",
    syllables: ["ቀ", "ይ"],
    also: [],
    level: 2,
  },
  {
    en: "cat",
    word: "ድመት",
    roman: "dim-met",
    syllables: ["ድ", "መ", "ት"],
    also: [["ደ", "መ", "ት"]],
    level: 2,
  },
  {
    en: "dog",
    word: "ውሻ",
    roman: "wi-sha",
    syllables: ["ው", "ሻ"],
    also: [["ከ", "ል", "ብ"]],
    level: 2,
  },
  {
    en: "coffee",
    word: "ቡና",
    roman: "bu-na",
    syllables: ["ቡ", "ና"],
    also: [["ቡ", "ን"]],
    level: 2,
  },
  {
    en: "water",
    word: "ውኃ",
    roman: "wi-ha",
    syllables: ["ው", "ኃ"],
    also: [],
    level: 2,
  },
  {
    en: "moon",
    word: "ጨረቃ",
    roman: "che-re-ka",
    syllables: ["ጨ", "ረ", "ቃ"],
    also: [],
    level: 2,
  },
  {
    en: "tree",
    word: "ዛፍ",
    roman: "zaf",
    syllables: ["ዛ", "ፍ"],
    also: [],
    level: 2,
  },
  {
    en: "meat",
    word: "ስጋ",
    roman: "siga",
    syllables: ["ስ", "ጋ"],
    also: [],
    level: 2,
  },
  {
    en: "father",
    word: "አባት",
    roman: "a-bat",
    syllables: ["አ", "ባ", "ት"],
    also: [],
    level: 2,
  },
  {
    en: "sun",
    word: "ፀሐይ",
    roman: "tse-ha-y",
    syllables: ["ፀ", "ሐ", "ይ"],
    also: [],
    level: 3,
  },
  {
    en: "house",
    word: "ቤት",
    roman: "bet",
    syllables: ["ቤ", "ት"],
    also: [],
    level: 3,
  },
  {
    en: "friend",
    word: "ጓደኛ",
    roman: "gwa-de-nya",
    syllables: ["ጓ", "ደ", "ኛ"],
    also: [],
    level: 3,
  },
  {
    en: "mother",
    word: "እናት",
    roman: "e-nat",
    syllables: ["እ", "ና", "ት"],
    also: [],
    level: 3,
  },
  {
    en: "brother",
    word: "ወንድም",
    roman: "wen-dim",
    syllables: ["ወ", "ን", "ድ", "ም"],
    also: [],
    level: 3,
  },
  {
    en: "star",
    word: "ኮከብ",
    roman: "ko-keb",
    syllables: ["ኮ", "ከ", "ብ"],
    also: [],
    level: 3,
  },
  {
    en: "horse",
    word: "ፈረስ",
    roman: "fe-res",
    syllables: ["ፈ", "ረ", "ስ"],
    also: [],
    level: 3,
  },
  {
    en: "book",
    word: "መጽሐፍ",
    roman: "me-tsi-hif",
    syllables: ["መ", "ጽ", "ሐ", "ፍ"],
    also: [],
    level: 3,
  },
  ...GENERATED_WORDS,
];

/** Per-position (kaib) reading of a form for slot hints. */
export const POSITION_SOUNDS = [
  "ä/e",
  "u",
  "i",
  "a",
  "yē",
  "ə",
  "o",
] as const;

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  // avoid an already-solved shuffle for multi-tile rounds
  const solved =
    a.every((s, i) => s === arr[i]) && a.length > 2 ? false : false;
  if (a.length > 1 && a.every((s, i) => s === arr[i])) return shuffle(arr);
  return a;
}
