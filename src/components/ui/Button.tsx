import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "soft" | "outline";

const styles: Record<Variant, string> = {
  primary: "bg-[var(--green)] text-white shadow-[0_5px_0_var(--green-dark)]",
  soft: "bg-[var(--soft)] text-[var(--ink)] shadow-[0_4px_0_var(--soft-edge)]",
  outline:
    "bg-white text-[var(--green-dark)] border border-[var(--line)] shadow-[0_4px_0_var(--line)]",
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  icon?: ReactNode;
  children: ReactNode;
};

export default function Button({
  variant = "primary",
  icon,
  children,
  className = "",
  ...rest
}: Props) {
  return (
    <button
      type="button"
      className={`inline-flex min-h-16 items-center justify-center gap-2 rounded-2xl px-6 text-base font-bold transition active:translate-y-1 active:shadow-none disabled:opacity-50 ${styles[variant]} ${className}`}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}