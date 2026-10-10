"use client";

import type { ReactNode } from "react";

export type TileState =
  | "default"
  | "selected"
  | "placed"
  | "disabled"
  | "decoy";

const stateStyles: Record<TileState, string> = {
  default: "bg-white shadow-[0_5px_0_var(--soft-edge)] hover:-translate-y-1",
  selected:
    "bg-[var(--c1)] shadow-[0_5px_0_var(--c1-edge)] -translate-y-1 ring-4 ring-[var(--c1-edge)]/50",
  placed: "bg-[var(--c6)] shadow-[0_3px_0_var(--c6-edge)]",
  disabled: "bg-[var(--soft)] text-[var(--muted)] shadow-[0_3px_0_var(--soft-edge)] opacity-60",
  decoy: "bg-[var(--c2)] shadow-[0_5px_0_var(--c2-edge)]",
};

export default function Tile({
  glyph,
  sub,
  state = "default",
  colorIndex, // 1..7 position color, optional
  onClick,
  disabled,
  className = "",
  children,
}: {
  glyph: ReactNode;
  sub?: string;
  state?: TileState;
  colorIndex?: number;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  const colorStyle =
    colorIndex != null
      ? { background: `var(--c${colorIndex})`, boxShadow: `0 5px 0 var(--c${colorIndex}-edge)` }
      : undefined;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={sub ? `${glyph} (${sub})` : String(glyph)}
      style={colorStyle}
      className={`flex min-h-16 min-w-16 flex-col items-center justify-center rounded-[20px] px-3 py-2 transition-transform duration-150 ${
        colorStyle ? "" : stateStyles[state]
      } ${disabled ? "cursor-not-allowed" : "cursor-pointer active:translate-y-1"} ${className}`}
    >
      <span className="font-ethiopic text-4xl leading-none font-bold sm:text-5xl">
        {glyph}
      </span>
      {sub ? (
        <span className="mt-0.5 text-xs font-bold text-[var(--muted)]">{sub}</span>
      ) : null}
      {children}
    </button>
  );
}
