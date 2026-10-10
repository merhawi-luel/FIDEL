import { readFileSync, writeFileSync } from "node:fs";

const input = "scripts/data/amharic.jsonl";
const output = "src/data/generated-amharic-words.ts";
const ethiopicOnly = /^[\u1200-\u135A]+$/;
const entries = new Map();

for (const line of readFileSync(input, "utf8").split("\n")) {
  if (!line.trim()) continue;

  let entry;
  try {
    entry = JSON.parse(line);
  } catch {
    continue;
  }

  if (entry.lang_code !== "am" || !ethiopicOnly.test(entry.word)) continue;
  if ([...entry.word].length < 2 || [...entry.word].length > 8) continue;

  const gloss = entry.senses
    ?.flatMap((sense) => sense.glosses ?? [])
    .find((value) => value && !value.includes("(") && value.length <= 80);
  const roman = entry.forms?.find((form) => form.tags?.includes("romanization"))?.form;
  if (!gloss || !roman || entries.has(entry.word)) continue;

  const syllables = [...entry.word];
  const level = syllables.length <= 2 ? 1 : syllables.length <= 3 ? 2 : 3;
  entries.set(entry.word, {
    en: gloss,
    word: entry.word,
    roman,
    syllables,
    also: [],
    level,
  });
}

const words = [...entries.values()].slice(0, 1500);
const source = `import type { GameWord } from "./game-words";\n\nexport const GENERATED_WORDS: GameWord[] = ${JSON.stringify(words, null, 2)};\n`;
writeFileSync(output, source);
console.log(`Generated ${words.length} Amharic game words at ${output}`);