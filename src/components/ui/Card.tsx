import type { ReactNode } from "react";

export default function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[28px] bg-white p-6 shadow-[0_6px_0_var(--line),0_12px_30px_rgba(60,50,20,0.08)] ${className}`}
    >
      {children}
    </div>
  );
}