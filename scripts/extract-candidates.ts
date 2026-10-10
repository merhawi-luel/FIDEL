import { readFileSync, writeFileSync } from "node:fs";

const INPUT = "scripts/data/amharic.jsonl";
const OUTPUT = "scripts/candidates.json";

const SEEDS = [
  "cat", "dog", "cow", "bird", "sheep", "chicken", "fish", "horse", "donkey",
  "water", "bread", "milk", "egg", "coffee", "meat",
  "house", "tree", "sun", "moon", "star", "book", "door",
  "mother", "father", "sister", "brother", "baby", "friend",
  "eye", "hand", "nose", "mouth", "red", "green", "yellow",
];

type Sense = { glosses?: string[] };
type Form = { form: string; tags?: string[] };
type Entry = {
  word: string;
  lang_code?: string;
  pos?: string;
  senses?: Sense[];
  forms?: Form[];
};
type Candidate = {
  word: string;
  pos: string;
  gloss: string;
  exact: boolean;
  translit: string | null;
};

const ETHIOPIC_ONLY = /^[\u1200-\u135A]+$/;

function clean(gloss: string) {
  return gloss.toLowerCase().replace(/^(a|an|the)\s+/, "").trim();
}

function match(gloss: string, seed: string): "exact" | "loose" | null {
  const g = clean(gloss);
  if (g === seed) return "exact";
  if (g.startsWith(`${seed} (`) || g.startsWith(`${seed},`) || g.startsWith(`${seed};`)) {
    return "loose";
  }
  return null;
}

const found = new Map<string, Candidate[]>(SEEDS.map((s) => [s, []]));
const lines = readFileSync(INPUT, "utf8").split("\n").filter(Boolean);
let shortEntries = 0;

for (const line of lines) {
  let e: Entry;
  try {
    e = JSON.parse(line);
  } catch {
    continue;
  }
  if (e.lang_code && e.lang_code !== "am") continue;
  if (!ETHIOPIC_ONLY.test(e.word) || [...e.word].length > 4) continue;
  shortEntries++;

  const translit =
    e.forms?.find((f) => f.tags?.includes("romanization"))?.form ?? null;

  for (const sense of e.senses ?? []) {
    for (const gloss of sense.glosses ?? []) {
      for (const seed of SEEDS) {
        const m = match(gloss, seed);
        if (!m) continue;
        const list = found.get(seed)!;
        if (!list.some((c) => c.word === e.word)) {
          list.push({
            word: e.word,
            pos: e.pos ?? "",
            gloss,
            exact: m === "exact",
            translit,
          });
        }
      }
    }
  }
}

const out = SEEDS.map((en) => ({
  en,
  candidates: found
    .get(en)!
    .sort((a, b) => Number(b.exact) - Number(a.exact))
    .slice(0, 4),
}));

writeFileSync(OUTPUT, JSON.stringify(out, null, 2));

const missing = out.filter((o) => o.candidates.length === 0).map((o) => o.en);
console.log(`Read ${lines.length} lines, ${shortEntries} short Amharic entries.`);
console.log(`Wrote ${out.length} words to ${OUTPUT}`);
console.log(`No match for: ${missing.join(", ") || "none"}`);