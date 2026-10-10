"use client";

import { useEffect, useState } from "react";

export type Frame = "mobile" | "desktop";

export function useFrame(): [Frame, (f: Frame) => void] {
  const [frame, setFrame] = useState<Frame>("mobile");
  useEffect(() => {
    const saved = localStorage.getItem("fwg-frame");
    if (saved === "mobile" || saved === "desktop") setFrame(saved);
  }, []);
  const set = (f: Frame) => {
    setFrame(f);
    localStorage.setItem("fwg-frame", f);
  };
  return [frame, set];
}

export function FrameToggle({
  frame,
  onChange,
}: {
  frame: Frame;
  onChange: (f: Frame) => void;
}) {
  return (
    <div
      className="fixed top-3 right-3 z-50 flex gap-1 rounded-full bg-[var(--ink)] p-1 shadow-[0_4px_12px_rgba(0,0,0,0.25)]"
      role="tablist"
      aria-label="Prototype frame: mobile or desktop"
    >
      {(["mobile", "desktop"] as const).map((f) => (
        <button
          key={f}
          role="tab"
          aria-selected={frame === f}
          onClick={() => onChange(f)}
          className={`rounded-full px-4 py-1.5 text-sm font-bold capitalize transition ${
            frame === f
              ? "bg-white text-[var(--ink)]"
              : "bg-transparent text-white/80 hover:text-white"
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  );
}
