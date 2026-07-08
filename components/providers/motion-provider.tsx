"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { easeStandard } from "@/lib/motion";

/**
 * App-wide motion defaults. `reducedMotion="user"` makes every Motion
 * animation honor the OS "reduce motion" setting (transforms dropped,
 * opacity/color kept) without per-component checks.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.24, ease: easeStandard }}>
      {children}
    </MotionConfig>
  );
}
