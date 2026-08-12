"use client";

import { useLayoutEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Wordmark } from "@/components/brand/wordmark";
import { dur, easeOut } from "@/lib/motion";
import { useSetIntroDone } from "@/components/hub/intro-context";

type Stage = "in" | "out";

/**
 * Brand intro over the hub. Plays on every visit/reload of the home page —
 * the real page is already rendered underneath the whole time, so this is a
 * genuine reveal, not a fake load.
 *
 * Exit mirrors `transition-provider.tsx`: content fades first, then the panel
 * lifts a beat later (`delay: dur.base`), so the curtain never crossfades with
 * the content it's covering.
 */
export function IntroScreen({ tagline }: { tagline: string }) {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(true);
  const [stage, setStage] = useState<Stage>("in");
  const setIntroDone = useSetIntroDone();

  useLayoutEffect(() => {
    document.documentElement.style.overflow = "hidden";
    /*
     * Reduced motion shortens the hold rather than skipping the intro: the
     * preference is about movement, not about hiding content. MotionConfig
     * already strips the transforms, so what's left is a plain opacity fade.
     */
    const id = setTimeout(() => {
      setStage("out");
      // Flip as the curtain starts lifting (not on full unmount) so the cards'
      // own entrance animation overlaps the tail of the exit instead of
      // starting after a dead pause.
      setIntroDone(true);
    }, reduce ? 1100 : 1800);
    return () => clearTimeout(id);
  }, [reduce, setIntroDone]);

  // Belt-and-braces: never leave the page unscrollable if this unmounts mid-exit.
  useLayoutEffect(() => () => {
    document.documentElement.style.overflow = "";
  }, []);

  if (!show) return null;

  function finish() {
    if (stage !== "out") return;
    document.documentElement.style.overflow = "";
    setShow(false);
  }

  return (
    <motion.div
      aria-hidden
      className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-cinematic"
      initial={{ opacity: 1 }}
      animate={{ opacity: stage === "out" ? 0 : 1 }}
      transition={{ duration: dur.base, ease: easeOut, delay: stage === "out" ? dur.base : 0 }}
      onAnimationComplete={finish}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--vignette)" }}
      />

      <motion.div
        className="relative flex flex-col items-center text-center"
        animate={{ opacity: stage === "out" ? 0 : 1 }}
        transition={{ duration: dur.base, ease: easeOut }}
      >
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: dur.slow, ease: easeOut }}
        >
          <Wordmark outline className="text-[clamp(3.5rem,12vw,9rem)] tracking-[0.01em]" />
        </motion.div>

        <motion.p
          className="mt-3 text-eyebrow text-xs text-ink-muted sm:text-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: dur.slow, ease: easeOut, delay: 0.35 }}
        >
          {tagline}
        </motion.p>

        <motion.span
          className="mt-6 block h-px w-32 origin-center bg-accent sm:w-44"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: dur.cine, ease: easeOut, delay: 0.6 }}
        />
      </motion.div>
    </motion.div>
  );
}
