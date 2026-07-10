"use client";

import { motion } from "motion/react";
import { Wordmark } from "@/components/brand/wordmark";
import { staggerContainer, fadeUp } from "@/lib/motion";
import type { Brand } from "@/types/content";

export function BrandHero({ brand }: { brand: Brand }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="flex flex-col items-center text-center"
    >
      <motion.p variants={fadeUp} className="text-eyebrow text-xs text-ink-faint sm:text-sm">
        Est. {brand.established} — {brand.location}
      </motion.p>

      <motion.div variants={fadeUp} className="mt-1">
        <Wordmark outline className="text-[clamp(3.75rem,13vw,9.5rem)] tracking-[0.01em]" />
      </motion.div>

      <motion.p
        variants={fadeUp}
        className="mt-2 max-w-xl text-balance text-base text-ink-muted sm:text-lg"
      >
        {brand.message}
      </motion.p>
    </motion.div>
  );
}
