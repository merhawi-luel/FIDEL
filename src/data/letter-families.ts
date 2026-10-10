/**
 * Letter families: base consonant + the 7 forms of the Amharic order (kaib).
 *
 * Base is the 4th form (the "ä/a" sound) in position 4 of the row.
 * Row order: 1 ሀ he · 2 ሁ hu · 3 ሂ hi · 4 ሃ ha · 5 ሄ hay · 6 ህ (h) · 7 ሆ ho
 */
export type LetterFamily = {
  base: string; // 4th form, e.g. ሃ
  sounds: [string, string, string, string, string, string, string]; // he hu hi ha hay h ho
  forms: [string, string, string, string, string, string, string]; // the 7 glyphs
};

// The rows are generated from the base glyph with the standard order.
// forms[n] = nth form of the base family.
const FAMILY_ROOTS = [
  "h", "l", "hh", "m", "sh", "r", "s", "sh", "q", "b", "v", "t", "ch",
  "kh", "n", "ny", "a", "k", "kh", "w", "a", "z", "zh", "y", "d",
  "j", "g", "t", "ch", "p", "ts", "ts", "f", "p",
] as const;

const FAMILIES_BODY: Array<{
  sounds: [string, string, string, string, string, string, string];
  row: [string, string, string, string, string, string, string];
}> = [
  ["ሀ", "ሁ", "ሂ", "ሃ", "ሄ", "ህ", "ሆ"],
  ["ለ", "ሉ", "ሊ", "ላ", "ሌ", "ል", "ሎ"],
  ["ሐ", "ሑ", "ሒ", "ሓ", "ሔ", "ሕ", "ሖ"],
  ["መ", "ሙ", "ሚ", "ማ", "ሜ", "ም", "ሞ"],
  ["ሠ", "ሡ", "ሢ", "ሣ", "ሤ", "ሥ", "ሦ"],
  ["ረ", "ሩ", "ሪ", "ራ", "ሬ", "ር", "ሮ"],
  ["ሰ", "ሱ", "ሲ", "ሳ", "ሴ", "ስ", "ሶ"],
  ["ሸ", "ሹ", "ሺ", "ሻ", "ሼ", "ሽ", "ሾ"],
  ["ቀ", "ቁ", "ቂ", "ቃ", "ቄ", "ቅ", "ቆ"],
  ["በ", "ቡ", "ቢ", "ባ", "ቤ", "ብ", "ቦ"],
  ["ቨ", "ቩ", "ቪ", "ቫ", "ቬ", "ቭ", "ቮ"],
  ["ተ", "ቱ", "ቲ", "ታ", "ቴ", "ት", "ቶ"],
  ["ቸ", "ቹ", "ቺ", "ቻ", "ቼ", "ች", "ቾ"],
  ["ኀ", "ኁ", "ኂ", "ኃ", "ኄ", "ኅ", "ኆ"],
  ["ነ", "ኑ", "ኒ", "ና", "ኔ", "ን", "ኖ"],
  ["ኘ", "ኙ", "ኚ", "ኛ", "ኜ", "ኝ", "ኞ"],
  ["አ", "ኡ", "ኢ", "ኣ", "ኤ", "እ", "ኦ"],
  ["ከ", "ኩ", "ኪ", "ካ", "ኬ", "ክ", "ኮ"],
  ["ኸ", "ኹ", "ኺ", "ኻ", "ኼ", "ኽ", "ኾ"],
  ["ወ", "ዉ", "ዊ", "ዋ", "ዌ", "ው", "ዎ"],
  ["ዐ", "ዑ", "ዒ", "ዓ", "ዔ", "ዕ", "ዖ"],
  ["ዘ", "ዙ", "ዚ", "ዛ", "ዜ", "ዝ", "ዞ"],
  ["ዠ", "ዡ", "ዢ", "ዣ", "ዤ", "ዥ", "ዦ"],
  ["የ", "ዩ", "ዪ", "ያ", "ዬ", "ይ", "ዮ"],
  ["ደ", "ዱ", "ዲ", "ዳ", "ዴ", "ድ", "ዶ"],
  ["ጀ", "ጁ", "ጂ", "ጃ", "ጄ", "ጅ", "ጆ"],
  ["ገ", "ጉ", "ጊ", "ጋ", "ጌ", "ግ", "ጎ"],
  ["ጠ", "ጡ", "ጢ", "ጣ", "ጤ", "ጥ", "ጦ"],
  ["ጨ", "ጩ", "ጪ", "ጫ", "ጬ", "ጭ", "ጮ"],
  ["ጰ", "ጱ", "ጲ", "ጳ", "ጴ", "ጵ", "ጶ"],
  ["ጸ", "ጹ", "ጺ", "ጻ", "ጼ", "ጽ", "ጾ"],
  ["ፀ", "ፁ", "ፂ", "ፃ", "ፄ", "ፅ", "ፆ"],
  ["ፈ", "ፉ", "ፊ", "ፋ", "ፌ", "ፍ", "ፎ"],
  ["ፐ", "ፑ", "ፒ", "ፓ", "ፔ", "ፕ", "ፖ"],
].map((row, familyIndex) => ({
  row: row as [string, string, string, string, string, string, string],
  sounds: row.map((_, index) => `${FAMILY_ROOTS[familyIndex]}${["e", "u", "i", "a", "ay", "", "o"][index]}`) as [string, string, string, string, string, string, string],
}));

export const FAMILIES: LetterFamily[] = FAMILIES_BODY.map((f) => ({
  base: f.row[3],
  sounds: f.sounds,
  forms: f.row,
}));

/** Position shell colors 1..7 (same tokens as the chart's edges). */
export const POSITION_COLORS: Array<{
  fill: string;
  edge: string;
}> = Array.from({ length: 7 }, (_, i) => ({
  fill: `var(--c${i + 1})`,
  edge: `var(--c${i + 1}-edge)`,
}));

export type FamilyDifficulty = "easy" | "medium" | "hard" | "partial";
