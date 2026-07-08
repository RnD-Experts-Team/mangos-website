"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { dur, easeOut } from "@/lib/motion";

/** Scroll-into-view fade-up. Honors reduced motion via MotionConfig. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 22,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.3, margin: "0px 0px -10% 0px" }}
      transition={{ duration: dur.slow, ease: easeOut, delay }}
    >
      {children}
    </motion.div>
  );
}
