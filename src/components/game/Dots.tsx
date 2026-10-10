export default function Dots({
  total,
  done,
  current,
}: {
  total: number;
  done: number;
  current?: number;
}) {
  return (
    <div className="flex items-center gap-2" aria-label={`Round ${done + 1} of ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`h-3.5 w-3.5 rounded-full border-2 transition ${
            i < done
              ? "border-[var(--green)] bg-[var(--green)]"
              : i === (current ?? done)
                ? "border-[var(--green)] bg-[var(--green)]/25"
                : "border-[var(--line)] bg-white"
          }`}
        />
      ))}
    </div>
  );
}
