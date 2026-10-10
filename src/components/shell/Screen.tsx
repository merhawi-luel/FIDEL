import type { ReactNode } from "react";
import type { Frame } from "./FrameToggle";

/**
 * Renders app content inside the prototype frame matching the toggle.
 * Mobile = a 390x844 phone frame; Desktop = 1440x1024 frame.
 * Both carry a soft scenic backdrop (sun, hills, floating puffs)
 * behind app content so screens feel like a garden, not a wireframe.
 */
export function Screen({
  frame,
  children,
}: {
  frame: Frame;
  children: ReactNode;
}) {
  const inner =
    "flex h-[94vh] w-full max-w-[1500px] flex-col overflow-hidden rounded-[40px] border-[10px] border-[#2a1f14] bg-[var(--paper)] shadow-[0_30px_80px_rgba(60,50,20,0.35)]";

  return (
    <div className="screen-viewport relative flex min-h-screen items-center justify-center overflow-hidden bg-[#2c2c2c] p-4">
      <div className={`screen-frame relative ${inner} paper-shell`}>
        <div className="relative z-10 flex min-h-0 flex-1 flex-col">{children}</div>
      </div>
    </div>
  );
}
