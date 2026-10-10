"use client";

const COLORS = [
  "var(--c1-edge)",
  "var(--c2-edge)",
  "var(--c3-edge)",
  "var(--c4-edge)",
  "var(--c5-edge)",
  "var(--c6-edge)",
  "var(--c7-edge)",
];

export default function Confetti({ pieces = 28 }: { pieces?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden>
      {Array.from({ length: pieces }, (_, i) => {
        const left = (i * 37) % 100;
        const delay = (i % 10) * 0.09;
        const dur = 1.6 + ((i * 7) % 9) / 10;
        const size = 8 + (i % 3) * 4;
        const color = COLORS[i % COLORS.length];
        const round = i % 4 === 0;
        return (
          <span
            key={i}
            className="absolute top-[-20px] animate-[fall_linear_forwards]"
            style={{
              left: `${left}%`,
              width: size,
              height: round ? size : size * 1.6,
              background: color,
              borderRadius: round ? "50%" : 3,
              animationDelay: `${delay}s`,
              animationName: "fall",
              animationDuration: `${dur}s`,
              animationTimingFunction: "linear",
              animationFillMode: "forwards",
            }}
          />
        );
      })}
    </div>
  );
}
