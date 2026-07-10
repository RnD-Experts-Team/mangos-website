"use client";

import { motion } from "motion/react";
import { dur, easeInOut } from "@/lib/motion";

/**
 * Ambient crimson orbs bleeding past the hub's side gutters. Positioned mostly
 * outside the section so its own `overflow-hidden` clips them — that clipping
 * is what reads as light glowing in from just beyond the screen edge. Drifts
 * on x/y and breathes in scale + opacity so the page never feels static.
 */
export function SideGlow() {
  const loop = { duration: dur.cine * 9, ease: easeInOut, repeat: Infinity };
  const orbStyle = {
    background:
      "radial-gradient(circle, var(--color-accent-deep) 0%, var(--color-accent-strong) 35%, transparent 70%)",
    filter: "blur(90px)",
  };

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-[18vw] top-[18%] h-[60vh] w-[60vh] rounded-full"
        style={orbStyle}
        animate={{ x: [0, 36, 0], y: [0, -26, 0], scale: [1, 1.1, 1], opacity: [0.22, 0.4, 0.22] }}
        transition={loop}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-[18vw] bottom-[14%] h-[60vh] w-[60vh] rounded-full"
        style={orbStyle}
        animate={{ x: [0, -36, 0], y: [0, 26, 0], scale: [1, 1.1, 1], opacity: [0.22, 0.4, 0.22] }}
        transition={{ ...loop, delay: loop.duration / 2 }}
      />
    </>
  );
}
