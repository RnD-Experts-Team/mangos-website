"use client";

import { motion } from "motion/react";
import { dur, easeOut } from "@/lib/motion";

function WalkGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden className="text-accent">
      <circle cx="13" cy="4" r="2" fill="currentColor" />
      <path
        d="M13 8l-3 2-2 5m5-7l2 2 3 1m-5-3v5l2 4m-2-9l-3 2-1 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function WalkConnector({ note }: { note: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-7 text-ink-faint sm:gap-4">
      <motion.span
        className="h-px w-14 origin-right sm:w-28"
        style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.3))" }}
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: dur.slow, ease: easeOut }}
      />
      <span className="inline-flex items-center gap-2 whitespace-nowrap text-eyebrow text-[11px]">
        <WalkGlyph />
        {note}
      </span>
      <motion.span
        className="h-px w-14 origin-left sm:w-28"
        style={{ background: "linear-gradient(to left, transparent, rgba(255,255,255,0.3))" }}
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: dur.slow, ease: easeOut }}
      />
    </div>
  );
}
