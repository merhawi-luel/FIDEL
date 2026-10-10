"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import Mascot from "@/components/game/Mascot";
import Tile from "@/components/game/Tile";
import Slot from "@/components/game/Slot";
import Dots from "@/components/game/Dots";
import Confetti from "@/components/game/Confetti";
import { WORDS, shuffle, type GameWord } from "@/data/game-words";
import type { Frame } from "@/components/shell/FrameToggle";
import {
  loadProgress,
  saveProgress,
  type Progress,
} from "@/lib/progress";

type Phase = "play" | "success" | "tryagain" | "wordtoo" | "complete";

const STICKERS = ["🌱", "🌻", "🍓", "🦋", "🐝", "🌈", "🐞", "🌼"];

const OOPS_LINES = [
  "Almost! Try again 🌱",
  "So close! One more time",
  "Nice guess — let's retry!",
];

const WORD_TOO_LINES = [
  "Wow — that's a word too!",
  "You made a real word!",
  "Another word found!",
];

function pickWords(level: number, count: number): GameWord[] {
  const lengthMatches = WORDS.filter((word) => {
    const length = word.syllables.length;
    if (level === 1) return length <= 2;
    if (level === 2) return length === 3;
    return length >= 4;
  });
  const levelMatches = WORDS.filter((word) => word.level === level);
  const pool = lengthMatches.length >= count ? lengthMatches : levelMatches;
  return shuffle(pool.length ? pool : WORDS).slice(0, count);
}

export default function WordGame({
  level,
  frame,
  onHome,
}: {
  level: number;
  frame: Frame;
  onHome: () => void;
}) {
  const totalRounds = 5;
  const [roundIndex, setRoundIndex] = useState(0);
  const [sessionWords] = useState(() => pickWords(level, totalRounds));
  const [phase, setPhase] = useState<Phase>("play");
  const [selected, setSelected] = useState<number | null>(null);
  const [slots, setSlots] = useState<(number | null)[]>([]);
  const [shakeSlot, setShakeSlot] = useState<number | null>(null);
  const [mascot, setMascot] = useState<"idle" | "happy" | "oops" | "hint">("idle");
  const [message, setMessage] = useState<string>("Build the word!");
  const [progress, setProgress] = useState<Progress | null>(null);
  const [hintTimes, setHintTimes] = useState(0);
  const starRef = useRef<HTMLSpanElement>(null);
  const draggingTile = useRef<number | null>(null);
  const draggedWithPointer = useRef(false);
  const suppressNextClick = useRef(false);

  const word = sessionWords[roundIndex % sessionWords.length];

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const tray = useMemo(
    () => shuffle(word.syllables.map((syl, i) => ({ syl, i }))),
    [word],
  );

  useEffect(() => {
    setSlots(Array(word.syllables.length).fill(null));
    setSelected(null);
    setPhase("play");
    setMascot("idle");
    setMessage("Build the word!");
  }, [word]);

  useEffect(() => {
    function finishPointerDrag(event: PointerEvent) {
      const trayIdx = draggingTile.current;
      if (trayIdx === null) return;

      const target = document.elementFromPoint(event.clientX, event.clientY);
      const slot = target?.closest("[data-word-slot]");
      const slotIndex = slot?.getAttribute("data-word-slot-index");

      if (draggedWithPointer.current && slotIndex !== null && slotIndex !== undefined) {
        placeTile(trayIdx, Number(slotIndex));
        suppressNextClick.current = true;
      }

      draggingTile.current = null;
      draggedWithPointer.current = false;
    }

    function trackPointer(event: PointerEvent) {
      if (draggingTile.current === null) return;
      if (Math.abs(event.movementX) + Math.abs(event.movementY) > 4) {
        draggedWithPointer.current = true;
      }
    }

    window.addEventListener("pointermove", trackPointer);
    window.addEventListener("pointerup", finishPointerDrag);
    window.addEventListener("pointercancel", finishPointerDrag);
    return () => {
      window.removeEventListener("pointermove", trackPointer);
      window.removeEventListener("pointerup", finishPointerDrag);
      window.removeEventListener("pointercancel", finishPointerDrag);
    };
  });

  const placedCount = slots.filter((s) => s !== null).length;
  const solved =
    slots.length > 0 &&
    slots.every(
      (s, i) => s !== null && tray[s]?.syl === word.syllables[i],
    );
  const full = placedCount === word.syllables.length;

  const isAltWord = () => {
    if (!full) return false;
    const seq = slots.map((s) => (s === null ? "" : tray[s]?.syl ?? ""));
    return word.also.some(
      (alt) => alt.length === seq.length && alt.every((s, i) => s === seq[i]),
    );
  };

  function check() {
    if (!full) {
      setMessage("Fill all the slots first!");
      setMascot("hint");
      return;
    }
    if (solved) {
      const gained = 1 + hintTimes;
      setPhase("success");
      setMascot("happy");
      setProgress((p) => {
        const np: Progress = p ?? loadProgress();
        const updated: Progress = {
          ...np,
          stars: np.stars + gained,
          learned: {
            ...np.learned,
            [word.en]: (np.learned[word.en] ?? 0) + 1,
          },
          unlocked: Math.max(np.unlocked, Math.min(3, level + 1)),
        };
        saveProgress(updated);
        return updated;
      });
    } else if (isAltWord()) {
      setPhase("wordtoo");
      setMascot("happy");
      setMessage(WORD_TOO_LINES[roundIndex % WORD_TOO_LINES.length]);
      setSlots(Array(word.syllables.length).fill(null));
      setSelected(null);
      setTimeout(() => setMascot("idle"), 1600);
    } else {
      setPhase("tryagain");
      setMascot("oops");
      setMessage(OOPS_LINES[roundIndex % OOPS_LINES.length]);
      setShakeSlot(0);
      setTimeout(() => {
        setShakeSlot(null);
        setSlots(Array(word.syllables.length).fill(null));
        setSelected(null);
        setPhase("play");
        setMascot("idle");
      }, 900);
    }
  }

  function hint() {
    const nextEmpty = slots.findIndex((s) => s === null);
    if (nextEmpty === -1) return;
    setHintTimes((h) => h + 1);
    setMascot("hint");
    // auto place first missing correct tile if any pending matches next slot
    const targetSyl = word.syllables[nextEmpty];
    const trayIdx = tray.findIndex(
      (t, i) => t.syl === targetSyl && !slots.includes(i),
    );
    if (trayIdx !== -1) {
      const ns = [...slots];
      ns[nextEmpty] = trayIdx;
      setSlots(ns);
    }
    setTimeout(() => setMascot("idle"), 900);
  }

  function skip() {
    nextRound();
  }

  function nextRound() {
    if (roundIndex + 1 >= totalRounds) {
      setPhase("complete");
      setMascot("happy");
      return;
    }
    setRoundIndex((r) => r + 1);
    setHintTimes(0);
  }

  function placeTile(trayIdx: number, slotIdx: number) {
    // remove if it was already placed somewhere
    const cleaned = slots.map((s) => (s === trayIdx ? null : s));
    const ns = [...cleaned];
    ns[slotIdx] = trayIdx;
    setSlots(ns);
    setSelected(null);
    setShakeSlot(null);
    const correct = tray[trayIdx].syl === word.syllables[slotIdx];
    if (!correct) {
      setShakeSlot(slotIdx);
      setMascot("oops");
      setTimeout(() => {
        setShakeSlot(null);
        setMascot("idle");
      }, 500);
    }
  }

  function clickTile(trayIdx: number) {
    if (suppressNextClick.current) {
      suppressNextClick.current = false;
      return;
    }

    const placedAt = slots.indexOf(trayIdx);
    if (placedAt !== -1) {
      const nextSlots = [...slots];
      nextSlots[placedAt] = null;
      setSlots(nextSlots);
      setSelected(null);
      return;
    }

    const nextEmpty = slots.findIndex((slot) => slot === null);
    if (nextEmpty !== -1) {
      placeTile(trayIdx, nextEmpty);
      return;
    }

    setSelected(selected === trayIdx ? null : trayIdx);
  }

  const starsEarned = progress?.stars ?? 0;
  const sticker = STICKERS[level % STICKERS.length];

  /* ---------------- success overlay ---------------- */
  if (phase === "success") {
    return (
      <SuccessView
        word={word}
        frame={frame}
        stars={starsEarned}
        onNext={nextRound}
        onHome={onHome}
      />
    );
  }

  if (phase === "complete") {
    return (
      <CompleteView
        frame={frame}
        stars={starsEarned}
        sticker={sticker}
        onHome={onHome}
        onReplay={() => {
          setRoundIndex(0);
          setPhase("play");
          setMascot("idle");
        }}
      />
    );
  }

  /* ---------------- play / try-again / word-too ---------------- */
  const desktop = frame === "desktop";
  return (
    <div className="word-game relative flex h-full min-h-0 flex-1 flex-col">
      {phase === "wordtoo" && <Confetti pieces={20} />}

      {/* top bar */}
      <header className="flex items-center justify-between px-5 pt-5 pb-2">
        <button
          onClick={onHome}
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-[0_4px_0_var(--soft-edge)] transition active:translate-y-1 active:shadow-none"
          aria-label="Back home"
        >
          ←
        </button>
        <Badge level={level} />
        <div className="rounded-full bg-white/85 px-4 py-2 shadow-[0_4px_0_var(--soft-edge)]">
          <Dots total={totalRounds} done={roundIndex} current={roundIndex} />
        </div>
      </header>

      <div
        className={`word-game-layout flex min-h-0 flex-1 gap-6 px-4 pb-4 ${
          desktop ? "flex-row items-stretch" : "flex-col"
        }`}
      >
        {/* left column (desktop) / top (mobile): meaning + mascot */}
        <div
          className={`flex flex-col items-center justify-center gap-3 ${
            desktop ? "w-[38%]" : ""
          }`}
        >
          {/* picture placeholder card */}
          <div className="relative flex h-40 w-40 items-center justify-center rounded-[28px] border-[3px] border-dashed border-[var(--c5-edge)] bg-white/90 text-6xl shadow-[0_8px_0_var(--line)]">
            <span className="opacity-90">🖼️</span>
            <span className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--c2)] text-sm shadow-[0_2px_0_var(--c2-edge)]">
              📷
            </span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-5xl font-black tracking-wide">{word.en}</h1>
            <button
              className="flex h-16 w-16 animate-[breathe_2.5s_ease-in-out_infinite] items-center justify-center rounded-full bg-[var(--c5)] text-3xl shadow-[0_5px_0_var(--c5-edge)] transition active:translate-y-1 active:shadow-none"
              aria-label="Hear the word (audio coming soon)"
              title="Audio coming soon"
            >
              🔊
            </button>
          </div>
          <Mascot
            mood={mascot}
            size={desktop ? 110 : 84}
            className={phase === "tryagain" ? "animate-[bounce-back_0.9s_ease]" : ""}
          />
          <p className="min-h-6 text-center text-lg font-bold text-[var(--muted)]">
            {message}
          </p>
        </div>

        {/* right column (desktop) / bottom (mobile): slots + tray */}
        <div className="flex min-h-0 flex-1 flex-col justify-end gap-3">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {slots.map((s, i) => {
              const filled = s !== null;
              const t = filled ? tray[s] : null;
              return (
                <Slot
                  key={i}
                  slotIndex={i}
                  filled={filled}
                  glow={selected !== null && !filled}
                  shake={shakeSlot === i || (phase === "tryagain" && shakeSlot === 0)}
                  onClick={() => {
                    if (selected !== null) placeTile(selected, i);
                    else if (filled) {
                      // tap placed tile to return it
                      const ns = [...slots];
                      ns[i] = null;
                      setSlots(ns);
                    }
                  }}
                >
                  {t ? (
                    <span
                      className={`font-ethiopic text-4xl font-bold sm:text-5xl ${
                        solved ? "animate-[pop_0.4s_ease-out]" : ""
                      }`}
                    >
                      {t.syl}
                    </span>
                  ) : null}
                </Slot>
              );
            })}
          </div>

          <div className="rounded-[26px] border-2 border-[var(--soft-edge)] bg-white/75 p-3 shadow-[0_6px_0_var(--soft-edge)] backdrop-blur">
            <p className="mb-1 text-center text-xs font-black uppercase tracking-widest text-[var(--muted)]">
              Pick a tile
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {tray.map((t, i) => {
                const isPlaced = slots.includes(i);
                if (isPlaced) {
                  return (
                    <Tile
                      key={i}
                      glyph={t.syl}
                      sub={word.roman.split("-")[i]}
                      state="placed"
                      onClick={() => clickTile(i)}
                      onPointerDown={(event) => {
                        event.preventDefault();
                        draggingTile.current = i;
                      }}
                    />
                  );
                }
                return (
                  <Tile
                    key={i}
                    glyph={t.syl}
                    sub={word.roman.split("-")[i]}
                    state={selected === i ? "selected" : "default"}
                    onClick={() => clickTile(i)}
                    onPointerDown={(event) => {
                      event.preventDefault();
                      draggingTile.current = i;
                    }}
                  />
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Button variant="soft" onClick={hint}>
              💡 Hint
            </Button>
            <Button
              className="animate-[breathe_2s_ease-in-out_infinite] disabled:animate-none"
              onClick={check}
              disabled={!full}
            >
              ✅ Check
            </Button>
            <Button variant="outline" onClick={skip}>
              Skip ⏭
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SuccessView({
  word,
  frame,
  stars,
  onNext,
  onHome,
}: {
  word: GameWord;
  frame: Frame;
  stars: number;
  onNext: () => void;
  onHome: () => void;
}) {
  const desktop = frame === "desktop";
  return (
    <div className="relative flex h-full min-h-0 flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <Confetti />
      {/* flying star */}
      <span
        className="pointer-events-none absolute top-1/4 animate-[star-fly_1s_ease-out_forwards] text-5xl"
        aria-hidden
      >
        ⭐
      </span>
      <Mascot mood="happy" size={desktop ? 150 : 116} className="animate-[breathe_1.6s_ease-in-out_infinite]" />
      <span className="rounded-full bg-[var(--c7)] px-5 py-2 text-xl font-black text-[var(--green-dark)] shadow-[0_4px_0_var(--c7-edge)]">
        +1 ⭐
      </span>
      <div className="relative rounded-[32px] border-2 border-[var(--c1-edge)] bg-white px-10 py-6 shadow-[0_8px_0_var(--c1-edge),0_16px_36px_rgba(60,50,20,0.12)]">
        <span className="absolute -left-3 -top-3 text-2xl">✨</span>
        <span className="absolute -right-3 -bottom-3 text-2xl">✨</span>
        <p className="font-ethiopic text-6xl font-black sm:text-7xl">{word.word}</p>
        <p className="mt-1 text-lg font-bold text-[var(--muted)]">
          {word.roman} · {word.en}
        </p>
      </div>
      <p className="text-xl font-black">
        {stars} ⭐ collected
      </p>
      <div className="flex gap-3">
        <Button className="text-xl" onClick={onNext}>Next word →</Button>
        <Button variant="outline" onClick={onHome}>
          Home
        </Button>
      </div>
    </div>
  );
}

function CompleteView({
  frame,
  stars,
  sticker,
  onHome,
  onReplay,
}: {
  frame: Frame;
  stars: number;
  sticker: string;
  onHome: () => void;
  onReplay: () => void;
}) {
  const desktop = frame === "desktop";
  return (
    <div className="relative flex h-full min-h-0 flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <Confetti pieces={36} />
      <Mascot mood="happy" size={desktop ? 150 : 112} />
      <h2 className="text-3xl font-black">Session complete! 🎉</h2>
      <div className="rounded-full bg-[var(--c1)] px-6 py-2 text-2xl font-black text-[var(--amber-ink)] shadow-[0_4px_0_var(--c1-edge)]">
        ⭐ × {stars}
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="relative flex h-32 w-32 animate-[breathe_2.2s_ease-in-out_infinite] items-center justify-center rounded-full border-[3px] border-[var(--c4-edge)] bg-[var(--c4)] text-6xl shadow-[0_6px_0_var(--c4-edge)]">
          {sticker}
          <span className="absolute -top-1 -right-1 text-2xl">🌟</span>
        </div>
        <p className="font-black text-[var(--muted)]">New sticker for your garden!</p>
      </div>
      <div className="flex gap-3">
        <Button className="text-xl" onClick={onReplay}>Play again</Button>
        <Button variant="outline" onClick={onHome}>
          Home
        </Button>
      </div>
    </div>
  );
}

function Badge({
  level,
  tone,
  label,
}: {
  level?: number;
  tone?: "green";
  label?: string;
}) {
  const cls =
    tone === "green"
      ? "bg-[var(--c7)] text-[var(--green-dark)]"
      : "bg-[var(--c1)] text-[var(--amber-ink)]";
  return (
    <span className={`rounded-full px-4 py-1.5 text-sm font-bold ${cls}`}>
      {label ?? `Level ${level}`}
    </span>
  );
}
