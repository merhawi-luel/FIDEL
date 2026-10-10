export type AmharicNumber = {
  value: number; // 2
  en: string; // "two"
  word: string; // spoken word, e.g. ሁለት
  geez: string | null; // Ge'ez numeral, e.g. ፪ (zero has none)
  roman: string; // simple reading help
};

// Ordered from smallest to largest.
export const NUMBERS: AmharicNumber[] = [
  { value: 0, en: "zero", word: "ዜሮ", geez: null, roman: "ze-ro" },
  { value: 1, en: "one", word: "አንድ", geez: "፩", roman: "and" },
  { value: 2, en: "two", word: "ሁለት", geez: "፪", roman: "hu-let" },
  { value: 3, en: "three", word: "ሦስት", geez: "፫", roman: "sost" },
  { value: 4, en: "four", word: "አራት", geez: "፬", roman: "a-rat" },
  { value: 5, en: "five", word: "አምስት", geez: "፭", roman: "a-mist" },
  { value: 6, en: "six", word: "ስድስት", geez: "፮", roman: "si-dist" },
  { value: 7, en: "seven", word: "ሰባት", geez: "፯", roman: "se-bat" },
  { value: 8, en: "eight", word: "ስምንት", geez: "፰", roman: "si-mint" },
  { value: 9, en: "nine", word: "ዘጠኝ", geez: "፱", roman: "ze-tegn" },
  { value: 10, en: "ten", word: "አሥር", geez: "፲", roman: "a-sir" },
  { value: 20, en: "twenty", word: "ሃያ", geez: "፳", roman: "ha-ya" },
  { value: 30, en: "thirty", word: "ሠላሳ", geez: "፴", roman: "se-la-sa" },
  { value: 40, en: "forty", word: "አርባ", geez: "፵", roman: "ar-ba" },
  { value: 50, en: "fifty", word: "ሃምሳ", geez: "፶", roman: "ham-sa" },
  { value: 60, en: "sixty", word: "ስድሳ", geez: "፷", roman: "sid-sa" },
  { value: 70, en: "seventy", word: "ሰባ", geez: "፸", roman: "se-ba" },
  { value: 80, en: "eighty", word: "ሰማንያ", geez: "፹", roman: "se-man-ya" },
  { value: 90, en: "ninety", word: "ዘጠና", geez: "፺", roman: "ze-te-na" },
  { value: 100, en: "one hundred", word: "መቶ", geez: "፻", roman: "me-to" },
  { value: 1000, en: "one thousand", word: "ሺህ", geez: "፲፻", roman: "shih" },
];