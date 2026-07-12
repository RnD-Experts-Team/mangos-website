"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import type { ImageAsset } from "@/types/content";
import { dur, easeOut } from "@/lib/motion";

/** Full-bleed building-photo hero. Doubles as the landing spot for the morph. */
export function BusinessHero({
  image,
  eyebrow,
  title,
  children,
}: {
  image: ImageAsset;
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative flex h-[82svh] min-h-[540px] w-full items-end overflow-hidden">
      <Image src={image.src} alt={image.alt} fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0" style={{ background: "var(--scrim-bottom)" }} />
      <div className="absolute inset-0" style={{ background: "var(--vignette)" }} />

      <Container className="relative z-10 pb-14 sm:pb-20">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: dur.slow, ease: easeOut }}
          className="text-eyebrow text-xs text-ink sm:text-sm"
        >
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-accent align-middle" />
          {eyebrow}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: dur.slow, ease: easeOut }}
          className="mt-3 font-display text-[clamp(3rem,10vw,7rem)] leading-[0.92] text-white"
        >
          {title}
        </motion.h1>
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.26, duration: dur.slow, ease: easeOut }}
            className="mt-5"
          >
            {children}
          </motion.div>
        )}
      </Container>
    </section>
  );
}
