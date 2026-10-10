type Mood = "idle" | "happy" | "oops" | "hint";

const faces: Record<Mood, { mouth: string; brows: string }> = {
  idle: { mouth: "M 30 44 Q 40 50 50 44", brows: "" },
  happy: { mouth: "M 28 42 Q 40 56 52 42", brows: "" },
  oops: { mouth: "M 34 50 Q 40 44 46 50", brows: "" },
  hint: { mouth: "M 32 46 Q 40 52 48 46", brows: "" },
};

export default function Mascot({
  mood = "idle",
  size = 96,
  className = "",
}: {
  mood?: Mood;
  size?: number;
  className?: string;
}) {
  const f = faces[mood];
  return (
    <div
      className={`select-none ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg viewBox="0 0 80 80" width="100%" height="100%">
        {/* body: warm round sprout character */}
        <ellipse cx="40" cy="46" rx="28" ry="26" fill="#ffd76e" />
        <ellipse cx="40" cy="46" rx="28" ry="26" fill="none" stroke="#f4c84a" strokeWidth="3" />
        {/* leaf sprout on top (garden nod) */}
        <path d="M40 20 C 36 12, 28 12, 26 16 C 30 20, 36 20, 40 20" fill="#55a868" />
        <path d="M40 20 C 44 12, 52 12, 54 16 C 50 20, 44 20, 40 20" fill="#6fb063" />
        <rect x="39" y="18" width="2" height="6" rx="1" fill="#3a8250" />
        {/* eyes */}
        <circle cx="31" cy="40" r="4.5" fill="#1f3a2e" />
        <circle cx="49" cy="40" r="4.5" fill="#1f3a2e" />
        <circle cx="32.5" cy="38.5" r="1.4" fill="white" />
        <circle cx="50.5" cy="38.5" r="1.4" fill="white" />
        {mood === "oops" ? (
          <>
            <path d="M 26 33 l 7 3" stroke="#1f3a2e" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 54 33 l -7 3" stroke="#1f3a2e" strokeWidth="2.5" strokeLinecap="round" />
          </>
        ) : null}
        {/* blush */}
        <circle cx="24" cy="46" r="3.5" fill="#f0a070" opacity="0.6" />
        <circle cx="56" cy="46" r="3.5" fill="#f0a070" opacity="0.6" />
        {/* mouth */}
        <path d={f.mouth} stroke="#1f3a2e" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {/* feet */}
        <ellipse cx="31" cy="71" rx="6" ry="3.5" fill="#f0a070" />
        <ellipse cx="49" cy="71" rx="6" ry="3.5" fill="#f0a070" />
      </svg>
    </div>
  );
}
