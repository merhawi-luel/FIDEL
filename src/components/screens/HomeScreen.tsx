"use client";

import Mascot from "@/components/game/Mascot";
import { loadProgress, type Progress } from "@/lib/progress";
import { useEffect, useState } from "react";

export default function HomeScreen({
  frame,
  onPlay,
  onLetters,
  onProgress,
}: {
  frame: "mobile" | "desktop";
  onPlay: (level: number) => void;
  onLetters: () => void;
  onProgress: () => void;
}) {
  const [progress, setProgress] = useState<Progress | null>(null);
  useEffect(() => setProgress(loadProgress()), []);
  const stars = progress?.stars ?? 0;
  const unlocked = progress?.unlocked ?? 1;

  return (
    <div className="fidel-home">
      <div className="fidel-app">
        <div className="fidel-brandbar">
          <div className="fidel-brand">
            <div className="fidel-logo">✦</div>
            <div>
              <h1>Fidel</h1>
              <small>Word Garden</small>
            </div>
          </div>

          <button
            onClick={onProgress}
            className="fidel-stars"
            aria-label="My stars"
          >
            <span>★</span>
            <strong>{stars}</strong>
            <span className="text-sm font-extrabold">My stars</span>
          </button>
        </div>

        <div className="fidel-hero">
          <div className="hero-copy">
            <div className="hero-chip">✦ Learn Amharic, one word at a time</div>

            <h2>
              Ready to grow
              <br />
              your <span className="accent">word</span>
              <br />
              garden?
            </h2>

            <p>Listen, tap, and build your first words.</p>

            <button className="hero-play" onClick={() => onPlay(unlocked)}>
              ▶ Play
            </button>
          </div>

          <div className="level-stack">
            <LevelCard
              n={0}
              label="Letter families"
              active
              stars={Math.min(stars, 2)}
              onClick={onLetters}
            />
            <LevelCard
              n={1}
              label="First words"
              active={unlocked >= 1}
              stars={Math.min(stars, 3)}
              onClick={() => onPlay(1)}
            />
            <LevelCard
              n={2}
              label="Keep playing!"
              active={unlocked >= 2}
              stars={Math.min(Math.max(stars - 3, 0), 3)}
              onClick={() => onPlay(2)}
            />
            <LevelCard
              n={3}
              label="Keep playing!"
              active={unlocked >= 3}
              stars={Math.min(Math.max(stars - 6, 0), 3)}
              onClick={() => onPlay(3)}
            />
          </div>
        </div>

        <div className="mascot-wrap" aria-hidden="true">
          <div className="mascot-bubble">Salam!</div>
          <div className="hero-mascot">
            <Mascot size={170} mood="happy" />
          </div>
        </div>
      </div>
    </div>
  );
}

function LevelCard({
  n,
  label,
  active,
  stars,
  onClick,
}: {
  n: number;
  label: string;
  active: boolean;
  stars: number;
  onClick: () => void;
}) {
  const tone = n === 0 ? "level-0" : n === 1 ? "level-1" : n === 2 ? "level-2" : "level-3";

  return (
    <button
      onClick={onClick}
      disabled={!active}
      className={`level-card ${tone} ${active ? "opacity-100" : "opacity-55 grayscale"}`}
      style={{ cursor: active ? "pointer" : "not-allowed" }}
    >
      <div className="level-badge">{n === 0 ? "0" : n}</div>

      <div className="level-meta">
        <div className="level-title">
          <strong>{n === 0 ? "Level 0" : `Level ${n}`}</strong>
          <span>{label}</span>
        </div>

        <div className="level-stars" aria-label={`${stars} stars`}>
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={i < stars ? "filled" : ""}>★</span>
          ))}
        </div>
      </div>
    </button>
  );
}
