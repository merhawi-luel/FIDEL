"use client";

import type { ReactNode } from "react";

export default function Slot({
  filled,
  hint,
  glow,
  shake,
  pop,
  colorIndex, // 1..7
  index, // number badge (family game)
  onClick,
  children,
  className = "",
}: {
  filled?: boolean;
  hint?: string;
  glow?: boolean;
  shake?: boolean;
  pop?: boolean;
  colorIndex?: number;
  index?: number;
  onClick?: () => void;
  children?: ReactNode;
  className?: string;
}) {
  const fill = colorIndex != null ? `var(--c${colorIndex})` : "white";
  const edge = colorIndex != null ? `var(--c${colorIndex}-edge)` : "var(--soft-edge)";
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ background: fill, borderColor: edge }}
      className={`relative flex min-h-16 min-w-16 flex-col items-center justify-center rounded-[20px] border-4 border-dashed px-2 py-2 transition-all duration-150 ${
        glow ? "scale-105 ring-4 ring-[var(--green)]/40" : ""
      } ${shake && !filled ? "animate-[wiggle_0.4s_ease-in-out]" : ""} ${
        pop ? "animate-[pop_0.3s_ease-out]" : ""
      } ${className}`}
    >
      {index != null ? (
        <span
          className="absolute top-1 left-1.5 text-xs font-black opacity-50"
          style={{ color: edge }}
        >
          {index}
        </span>
      ) : null}
      {children ?? (
        <>
          <span
            className={`font-ethiopic text-4xl leading-none font-bold ${
              filled ? "" : "opacity-20"
            }`}
          >
            ·
          </span>
          {hint ? (
            <span
              className="mt-0.5 text-[11px] font-bold"
              style={{ color: edge }}
            >
              {hint}
            </span>
          ) : null}
        </>
      )}
    </button>
  );
}
