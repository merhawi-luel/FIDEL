"use client";

import { useState } from "react";
import Mascot from "@/components/game/Mascot";
import { FAMILIES, POSITION_COLORS, type FamilyDifficulty } from "@/data/letter-families";

export default function LettersScreen({
  frame,
  onBack,
  onPlayFamily,
}: {
  frame: "mobile" | "desktop";
  onBack: () => void;
  onPlayFamily: (familyIndex: number, difficulty: FamilyDifficulty) => void;
}) {
  const [difficulty, setDifficulty] = useState<FamilyDifficulty>("easy");
  const [selectedFamily, setSelectedFamily] = useState<number | null>(null);

  return (
    <div className="letters-page">
      <div className="letters-topbar">
        <button
          onClick={onBack}
          className="letters-back"
          aria-label="Back home"
        >
          ←
        </button>

        <div className="letters-title-wrap">
          <h1 className="letters-title">Letters</h1>
          <span className="letters-label">abc</span>
        </div>

        <div className="letters-mascot-wrap">
          <Mascot size={46} mood="hint" />
        </div>
      </div>

      <div className="letters-content">
        <div className="letters-level-row">
          <span className="letters-level-text">Level:</span>
          {(["easy", "medium", "hard", "partial"] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDifficulty(d)}
              className={`letters-level-btn ${difficulty === d ? "active" : ""}`}
            >
              {d}
            </button>
          ))}
        </div>

        <p className="letters-selection-note" aria-live="polite">
          {selectedFamily === null
            ? "Choose a letter family to practice"
            : `Family ${FAMILIES[selectedFamily].base} selected`}
        </p>

        <div className="letters-family-list">
          {FAMILIES.map((family, index) => (
            <div
              key={family.base}
              className={`letters-family-card ${selectedFamily === index ? "selected" : ""}`}
              role="button"
              tabIndex={0}
              aria-pressed={selectedFamily === index}
              onClick={() => setSelectedFamily(index)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setSelectedFamily(index);
                }
              }}
            >
              <div className="letters-family-header">
                <div className="letters-family-name-wrap">
                  <span className="letters-family-icon font-ethiopic">{family.base}</span>
                  <div className="letters-family-text">
                    <strong>Family {family.base}</strong>
                    <small>{family.sounds[0]}…{family.sounds[6]}</small>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setSelectedFamily(index);
                    onPlayFamily(index, difficulty);
                  }}
                  className="letters-play-btn"
                >
                  <span className="play-mark">▶</span> Play
                </button>
              </div>

              <div className="letters-strip-row">
                {family.forms.map((glyph, pos) => (
                  <div
                    key={pos}
                    className="letters-strip"
                    style={{
                      background: POSITION_COLORS[pos].fill,
                      borderColor: POSITION_COLORS[pos].edge,
                    }}
                  >
                    <span className="font-ethiopic">{glyph}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
