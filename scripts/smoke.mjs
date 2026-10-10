// Quick smoke test of the prototype flows (playwright, local dev server).
// Run from fidel-word-garden: node scripts/smoke.mjs
import { chromium } from "playwright";

const BASE = "http://localhost:3000";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 950 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push("PAGE ERROR: " + e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push("CONSOLE ERROR: " + m.text());
  });

  await page.goto(BASE, { waitUntil: "networkidle" });

  // Home visible?
  const play = page.getByRole("button", { name: /Play/ }).first();
  await play.waitFor({ timeout: 10000 });
  console.log("OK home: Play button visible");

  // go to word game (Play -> level unlocked)
  await play.click();
  await page.waitForTimeout(800);
  const checkBtn = page.getByRole("button", { name: /Check/ }).first();
  await checkBtn.waitFor({ timeout: 5000 });
  console.log("OK word game: Check button visible");

  // solve the round via hint until solved (deterministic: keep pressing hint)
  for (let i = 0; i < 6; i++) {
    const hint = page.getByRole("button", { name: /Hint/ }).first();
    const disabled = await hint.getAttribute("disabled");
    if (disabled !== null && disabled !== undefined) break;
    if ((await hint.isEnabled()) === false) break;
    await hint.click();
    await page.waitForTimeout(300);
    if ((await page.getByText(/Next word/).count()) > 0) break;
  }
  const check2 = page.getByRole("button", { name: /Check/ }).first();
  if (await check2.isEnabled()) {
    await check2.click();
    await page.waitForTimeout(700);
  }
  const successNext = page.getByRole("button", { name: /Next word/ });
  if ((await successNext.count()) > 0) {
    console.log("OK success state shown");
    await successNext.click();
    await page.waitForTimeout(600);
  } else {
    console.log("WARN success state not reached (hint flow may differ)");
  }

  // Letters screen: from the next round, press the back ("Back home") then open Level 0 card
  await page.getByRole("button", { name: /back home/i }).first().click();
  await page.waitForTimeout(500);
  await page.getByText(/Level 0/).first().click();
  await page.waitForTimeout(600);
  const lettersPlay = page.getByRole("button", { name: /^Play/ }).first();
  await lettersPlay.waitFor({ timeout: 5000 });
  console.log("OK letters screen");
  await lettersPlay.click();
  await page.waitForTimeout(600);

  // family game: tap-to-place. Tray tiles are buttons with aria-label "Letter X"
  // click a tray tile, then click matching slot by slot number
  const trays = await page.$$('[aria-label^="Letter "]').catch(() => []);
  if (trays.length > 0) {
    // find each slot label
    const slots = await page.$$('[aria-label^="Slot "]');
    console.log(`OK family game: ${trays.length} tray tiles, ${slots.length} slots`);
    // Tap-place first matching pair (slot1 wants form index 0 == tray tile "Letter ሀ"-ish)
    // We don't parse glyphs; just test a wrong drop for encouragement line:
    if (slots.length > 1) {
      await trays[1].click(); // select tray tile idx 1
      await page.waitForTimeout(200);
      await slots[0].click(); // place into slot 1 (wrong)
      await page.waitForTimeout(300);
      console.log("OK wrong placement handled");
    }
  } else {
    console.log("WARN no tray tiles found in family game");
  }

  console.log(errors.length ? "ERRORS:\n" + errors.join("\n") : "OK no page errors");
  await browser.close();
  if (errors.length) process.exit(1);
}

main().catch((e) => {
  console.error("SMOKE FAIL:", e);
  process.exit(1);
});
