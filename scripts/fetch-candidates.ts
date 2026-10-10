import { writeFileSync } from "node:fs";

const SEEDS = [
  "cat", "dog", "cow", "bird", "sheep", "chicken", "fish", "horse", "donkey",
  "water", "bread", "milk", "egg", "coffee", "meat",
  "house", "tree", "sun", "moon", "star", "book", "door",
  "mother", "father", "sister", "brother", "baby", "friend",
  "eye", "hand", "nose", "mouth", "red", "green", "yellow",
];

type Hit = { txt: string; trans_quality?: number };

const ETHIOPIC_ONLY = /^[\u1200-\u135A]+$/;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
let logged = false;

async function lookup(en: string) {
  const res = await fetch("https://api.panlex.org/v2/expr", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      uid: "amh-000",
      trans_uid: "eng-000",
      trans_txt: [en],
      include: ["trans_quality"],
    }),
  });
  if (!res.ok) throw new Error(`${en}: HTTP ${res.status}`);
  const data = await res.json();
  const hits: Hit[] = data.result ?? [];

  if (!logged) {
    console.log("first raw result:", JSON.stringify(hits[0]));
    logged = true;
  }

  return hits
    .filter((h) => ETHIOPIC_ONLY.test(h.txt) && [...h.txt].length <= 4)
    .sort((a, b) => (b.trans_quality ?? 0) - (a.trans_quality ?? 0))
    .slice(0, 4)
    .map((h) => ({ word: h.txt, quality: h.trans_quality ?? null }));
}

async function main() {
  const out: Array<{ en: string; candidates: unknown[] }> = [];
  for (const en of SEEDS) {
    try {
      out.push({ en, candidates: await lookup(en) });
    } catch (e) {
      console.error(String(e));
      out.push({ en, candidates: [] });
    }
    await sleep(600); // stay under 2 requests per second
  }
  writeFileSync("scripts/candidates.json", JSON.stringify(out, null, 2));
  console.log(`Wrote ${out.length} words to scripts/candidates.json`);
}

main();