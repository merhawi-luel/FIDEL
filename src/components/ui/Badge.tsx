import type { ReactNode } from "react";

type Tone = "yellow" | "green" | "blue" | "coral";

const tones: Record<Tone, string> = {
  yellow: "bg-[var(--c1)] text-[var(--amber-ink)]",
  green: "bg-[var(--c7)] text-[var(--green-dark)]",
  blue: "bg-[var(--c5)] text-[var(--blue-ink)]",
  coral: "bg-[var(--c3)] text-[var(--coral-ink)]",
};

export default function Badge({
  tone = "yellow",
  children,
}: {
  tone?: Tone;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex w-fit items-center gap-1 rounded-full px-4 py-1.5 text-sm font-bold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}