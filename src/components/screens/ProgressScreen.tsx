"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Mascot from "@/components/game/Mascot";
import { loadProgress, type Progress } from "@/lib/progress";
import { WORDS } from "@/data/game-words";
import { FAMILIES } from "@/data/letter-families";

export default function ProgressScreen({
  frame,
  onBack,
}: {
  frame: "mobile" | "desktop";
  onBack: () => void;
}) {
  const [progress, setProgress] = useState<Progress | null>(null);
  useEffect(() => setProgress(loadProgress()), []);
  const p = progress;
  const learnedCount = p ? Object.keys(p.learned).length : 0;
  const familiesDone = p?.familiesDone.length ?? 0;
  const stars = p?.stars ?? 0;
  const desktop = frame === "desktop";

  return (
    <div className="progress-screen flex h-full min-h-0 flex-1 flex-col">
      <header className="flex items-center justify-between px-5 pt-5 pb-2">
        <button
          onClick={onBack}
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-[0_4px_0_var(--soft-edge)] transition active:translate-y-1 active:shadow-none"
          aria-label="Back home"
        >
          ←
        </button>
        <h1 className="text-2xl font-black">My garden 🌳</h1>
        <Mascot size={54} mood="happy" />
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 pb-6">
        {/* stats strip */}
        <div className="flex justify-center gap-3">
          {[
            { k: "⭐", v: stars, tone: "bg-[var(--c1)]", edge: "var(--c1-edge)" },
            { k: "🔤", v: learnedCount, tone: "bg-[var(--c6)]", edge: "var(--c6-edge)" },
            { k: "🧩", v: familiesDone, tone: "bg-[var(--c4)]", edge: "var(--c4-edge)" },
          ].map((s) => (
            <div
              key={s.k}
              style={{ boxShadow: `0 5px 0 ${s.edge}` }}
              className={`flex min-h-16 flex-1 flex-col items-center justify-center rounded-[20px] ${s.tone}`}
            >
              <span className="text-xl">{s.k}</span>
              <span className="text-xl font-black">{s.v}</span>
            </div>
          ))}
        </div>

        <h2 className="text-lg font-black">Learned words</h2>
        <div
          className={`progress-word-grid grid gap-2 ${
            desktop ? "grid-cols-5" : "grid-cols-3"
          }`}
        >
          {WORDS.map((w) => {
            const got = p?.learned[w.en] ?? 0;
            return (
              <div
                key={w.en}
                className={`progress-word-card flex flex-col items-center justify-center rounded-[18px] p-2 text-center ${
                  got
                    ? "bg-[var(--c7)] shadow-[0_3px_0_var(--c7-edge)]"
                    : "bg-[var(--soft)] opacity-60"
                }`}
              >
                <span className="font-ethiopic text-2xl font-bold">{w.word}</span>
                <span className="text-xs font-bold text-[var(--muted)]">{w.en}</span>
                <span className="text-xs">{"⭐".repeat(Math.min(got, 3)) || "☆"}</span>
              </div>
            );
          })}
        </div>

        <h2 className="text-lg font-black">
          Letter families <span className="text-sm font-bold text-[var(--muted)]">({familiesDone}/{FAMILIES.length})</span>
        </h2>
        <div className="flex flex-wrap gap-2">
          {FAMILIES.map((f) => {
            const done = p?.familiesDone.includes(f.base);
            return (
              <div
                key={f.base}
                className={`font-ethiopic flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-bold ${
                  done
                    ? "bg-[var(--c5)] shadow-[0_3px_0_var(--c5-edge)]"
                    : "bg-[var(--soft)] opacity-60"
                }`}
              >
                {f.base}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-2 rounded-[22px] bg-[var(--c7)]/70 py-2 backdrop-blur">
          <Mascot size={56} className={learnedCount ? "animate-[breathe_2.4s_ease-in-out_infinite]" : ""} />
          <p className="text-sm font-black text-[var(--green-dark)]">
            {learnedCount === 0
              ? "Play a game to grow your garden! 🌱"
              : "Keep going — your garden is growing! 🌸"}
          </p>
        </div>
      </div>
    </div>
  );
}
