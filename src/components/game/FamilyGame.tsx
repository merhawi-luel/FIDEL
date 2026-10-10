"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import Mascot from "@/components/game/Mascot";
import Confetti from "@/components/game/Confetti";
import { FAMILIES, POSITION_COLORS, type FamilyDifficulty } from "@/data/letter-families";
import { shuffle } from "@/data/game-words";
import { loadProgress, saveProgress } from "@/lib/progress";
import type { Frame } from "@/components/shell/FrameToggle";

const ENCOURAGE = [
  "Try another spot! 🌱",
  "Almost — keep going!",
  "You can do it!",
];

type Placed = { trayIdx: number } | null;

function buildTray(count: number, row: string[], prefilled: boolean) {
  // returns array of {glyph, trayIdx} where prefilled leaves some at home
  const idxs = row.map((_, i) => i);
  if (!prefilled) return shuffle(idxs);
  // Partial: shuffle only 4 of the 7
  const moveIdx = shuffle(idxs).slice(0, count);
  return row.map((_, i) => i); // identity but UI marks the moved ones
}

export default function FamilyGame({
  familyIndex,
  difficulty: initialDifficulty = "easy",
  frame,
  onBack,
}: {
  familyIndex: number;
  difficulty: FamilyDifficulty;
  frame: Frame;
  onBack: () => void;
}) {
  const [difficulty, setDifficulty] = useState<FamilyDifficulty>(initialDifficulty);
  const family = FAMILIES[familyIndex % FAMILIES.length];
  const desktop = frame === "desktop";
  const [slots, setSlots] = useState<Placed[]>(Array(7).fill(null));
  const [selected, setSelected] = useState<number | null>(null); // tray idx
  const [hoverSlot, setHoverSlot] = useState<number | null>(null);
  const [shakeSlot, setShakeSlot] = useState<number | null>(null);
  const [poppedSlot, setPoppedSlot] = useState<number | null>(null);
  const [mascot, setMascot] = useState<"idle" | "happy" | "oops" | "hint">("idle");
  const [line, setLine] = useState("Drag the fidel into 1–7!");
  const [hintTile, setHintTile] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const [stars, setStars] = useState(0);
  const dragIdx = useRef<number | null>(null);

  // shuffle tray: glyph order we show at bottom
  const [trayOrder, setTrayOrder] = useState<number[]>(() =>
    shuffle(family.forms.map((_, i) => i)),
  );

  useEffect(() => {
    setSlots(Array(7).fill(null));
    setTrayOrder(shuffle(family.forms.map((_, i) => i)));
    setDone(false);
    setLine("Drag the fidel into 1–7!");
    // reset
  }, [family]);

  // Partial difficulty: pre-fill positions other than 4 shuffled ones
  useEffect(() => {
    if (difficulty !== "partial") return;
    const keep = shuffle([0, 1, 2, 3, 4, 5, 6]).slice(0, 3); // pre-filled
    setSlots((prev) => {
      const ns: Placed[] = [...prev];
      for (const k of keep) ns[k] = { trayIdx: k };
      return ns;
    });
    setTrayOrder((prev) => prev.filter((t) => !keep.includes(t)));
  }, [difficulty, family]);

  const solved = slots.every((s, i) => s !== null && s.trayIdx === i);

  useEffect(() => {
    if (solved && !done) {
      setDone(true);
      setMascot("happy");
      // sequential color pop
      const total = 7;
      for (let i = 0; i < total; i++) {
        setTimeout(() => setPoppedSlot(i), 140 * i);
      }
      setTimeout(() => setMascot("idle"), 1400);
      const p = loadProgress();
      const updated = {
        ...p,
        stars: p.stars + 1,
        familiesDone: p.familiesDone.includes(family.base)
          ? p.familiesDone
          : [...p.familiesDone, family.base],
      };
      saveProgress(updated);
      setStars(updated.stars);
    }
  }, [solved, done, family.base]);

  function tryPlace(trayIdx: number, slotIdx: number) {
    if (done) return;
    // wrong slot?
    if (trayIdx !== slotIdx) {
      setShakeSlot(slotIdx);
      setMascot("oops");
      setLine(ENCOURAGE[Math.floor(Math.random() * ENCOURAGE.length)]);
      setTimeout(() => {
        setShakeSlot(null);
        setMascot("idle");
      }, 600);
      return;
    }
    // correct: snap in
    setSlots((prev) => {
      const ns = [...prev];
      ns[slotIdx] = { trayIdx };
      // remove from tray
      setTrayOrder((t) => t.filter((x) => x !== trayIdx));
      return ns;
    });
    setPoppedSlot(slotIdx);
    setSelected(null);
    setHintTile(null);
    setTimeout(() => setPoppedSlot(null), 400);
  }

  function hint() {
    const nextEmpty = slots.findIndex((s) => s === null);
    if (nextEmpty === -1) return;
    // pulse the correct tile in tray (or, if it's prefilled-out, place it)
    const correctInTray = trayOrder.find((t) => t === nextEmpty);
    if (correctInTray != null) {
      setHintTile(correctInTray);
      setTimeout(() => setHintTile(null), 2000);
    }
    setMascot("hint");
    setTimeout(() => setMascot("idle"), 1200);
  }

  const rows = desktop ? [Array.from({ length: 7 }, (_, i) => i)] : [[0, 1, 2, 3], [4, 5, 6]];

  /* ------- complete overlay ------- */
  if (done) {
    return (
      <div className="relative flex h-full min-h-0 flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <Confetti />
        <Mascot mood="happy" size={desktop ? 150 : 116} className="animate-[breathe_1.6s_ease-in-out_infinite]" />
        <span className="rounded-full bg-[var(--c7)] px-5 py-2 text-xl font-black text-[var(--green-dark)] shadow-[0_4px_0_var(--c7-edge)]">
          +1 ⭐
        </span>
        <div className="rounded-[32px] border-2 border-[var(--c6-edge)] bg-white px-8 py-6 shadow-[0_8px_0_var(--c6-edge),0_16px_36px_rgba(60,50,20,0.12)]">
          <p className="font-ethiopic text-3xl font-black sm:text-4xl">
            {family.forms.join(" ")}
          </p>
          <p className="mt-1 text-lg font-bold text-[var(--muted)]">
            Family {family.forms[3]}: {family.sounds.join(" · ")}
          </p>
        </div>
        <p className="text-xl font-black">{stars} ⭐ collected</p>
        <div className="flex gap-3">
          <Button className="text-xl" onClick={() => onBack()}>Next family →</Button>
          <Button variant="outline" onClick={onBack}>
            All families
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="family-game flex h-full min-h-0 flex-1 flex-col px-4 pb-5 pt-3">
      <button
        onClick={onBack}
        className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-white text-2xl shadow-[0_4px_0_var(--soft-edge)]"
        aria-label="Back to letters"
      >
        ←
      </button>

      <div className="mb-2 flex items-center gap-3">
        <h2 className="text-[2.7rem] font-black tracking-[-0.07em] text-[#1f3a2e]">
          Family <span className="font-ethiopic">{family.base}</span>
        </h2>
      </div>

      <div className="mb-4 flex items-center gap-3 text-[1.15rem] text-[#475f53]">
        <span className="font-ethiopic">{family.sounds.join(" · ")}</span>
      </div>

      <div className="mb-6 flex justify-start">
        <div className="flex gap-2 rounded-[14px] bg-[#e3e0d8] p-1 shadow-[inset_0_0_0_1px_rgba(31,58,46,0.08)]">
          {(["easy", "medium", "hard", "partial"] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDifficulty(d)}
              className={`rounded-[10px] px-4 py-2 text-sm font-black capitalize ${
                difficulty === d ? "bg-white text-[#1f3a2e] shadow-[0_1px_0_rgba(31,58,46,0.08)]" : "text-[#495d52]"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5 flex flex-col gap-3">
        <div className="family-slot-grid grid grid-cols-7 gap-2">
          {family.forms.map((glyph, i) => {
            const c = POSITION_COLORS[i];
            const filled = slots[i] !== null;
            const isSelected = selected === i;
            const active = hoverSlot === i || filled || isSelected;

            return (
              <button
                key={i}
                type="button"
                onClick={() => {
                  if (selected !== null) tryPlace(selected, i);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setHoverSlot(i);
                }}
                onDragLeave={() => setHoverSlot(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  setHoverSlot(null);
                  if (dragIdx.current !== null) {
                    tryPlace(dragIdx.current, i);
                    dragIdx.current = null;
                  }
                }}
                style={{
                  background: filled ? c.fill : "rgba(255,255,255,0.32)",
                  borderColor: c.edge,
                  boxShadow: active ? "0 2px 0 rgba(60,50,20,0.08)" : "none",
                }}
                className={`relative flex h-[102px] w-full min-w-0 flex-col items-center justify-center rounded-[18px] border-[3px] border-dashed transition-all duration-150 ${
                  hoverSlot === i ? "scale-[1.02]" : ""
                } ${shakeSlot === i ? "animate-[wiggle_0.4s_ease-in-out]" : ""} ${
                  poppedSlot === i ? "animate-[pop_0.35s_ease-out]" : ""
                }`}
                aria-label={`Slot ${i + 1}`}
              >
                <span className="absolute left-2 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/80 text-[10px] font-black text-[#1f3a2e]">
                  {i + 1}
                </span>
                <span className="font-ethiopic text-[2rem] font-black text-[#1f3a2e]">
                  {filled ? family.forms[slots[i]!.trayIdx] : family.sounds[i]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-auto rounded-[24px] border border-[#d3d0c3] bg-[#e7e2d7] p-4 shadow-[0_6px_0_rgba(160,152,136,0.18)]">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <div className="text-[0.8rem] font-black uppercase tracking-[0.08em] text-[#54615b]">
              Your letters
            </div>
            <div className="text-sm text-[#53675d]">Drag one, or tap it then tap a slot</div>
          </div>

          <button
            type="button"
            onClick={hint}
            className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 text-sm font-bold text-[#495d52] shadow-[0_3px_0_rgba(168,157,136,0.38)]"
          >
            <span>💡</span> Hint
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {trayOrder.map((t) => {
            const active = selected === t;
            return (
              <button
                key={t}
                type="button"
                draggable
                onDragStart={() => {
                  dragIdx.current = t;
                }}
                onDragEnd={() => {
                  dragIdx.current = null;
                  setHoverSlot(null);
                }}
                onClick={() => setSelected(selected === t ? null : t)}
                className={`flex h-16 w-16 items-center justify-center rounded-[18px] border-[3px] border-transparent text-[#1f3a2e] shadow-[0_4px_0_rgba(142,131,108,0.32)] transition-transform ${
                  active ? "ring-2 ring-[#d7c86a]" : ""
                } ${hintTile === t ? "animate-[pulse-hint_1s_ease-in-out_infinite]" : ""}`}
                style={{
                  background: POSITION_COLORS[t].fill,
                  borderColor: POSITION_COLORS[t].edge,
                }}
                aria-label={`Letter ${family.forms[t]}`}
              >
                <span className="font-ethiopic text-4xl font-black">{family.forms[t]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DiffBadge({ difficulty }: { difficulty: FamilyDifficulty }) {
  const colors: Record<FamilyDifficulty, string> = {
    easy: "bg-[var(--c7)] text-[var(--green-dark)]",
    medium: "bg-[var(--c5)] text-[var(--blue-ink)]",
    hard: "bg-[var(--c3)] text-[var(--coral-ink)]",
    partial: "bg-[var(--c1)] text-[var(--amber-ink)]",
  };
  return (
    <span className={`rounded-full px-4 py-1.5 text-sm font-bold capitalize ${colors[difficulty]}`}>
      {difficulty}
    </span>
  );
}

function DotsInline({ done, total }: { done: number; total: number }) {
  return <span className="ml-1 text-sm font-bold text-[var(--muted)]">{done}/{total}</span>;
}
