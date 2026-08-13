"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { dur, easeOut } from "@/lib/motion";
import { HeroTransitionContext, type HeroTransitionPayload } from "@/hooks/use-hero-transition";

type Stage = "expand" | "hold" | "out";

/** Minimum time "hold" must last, so the transition always feels the same
 * length regardless of how fast the destination route actually committed. */
const HOLD_MIN_MS = 400;
/** Hard ceiling — never leave the veil stuck if navigation genuinely stalls. */
const PANIC_MS = 1800;

/**
 * Drives the hub → business photo morph. On `begin`, a copy of the clicked
 * building photo expands from its card rectangle to full-bleed while the route
 * loads; once expanded AND arrived, it fades to reveal the identical hero
 * beneath — so it reads as one continuous image. Reduced motion → plain nav.
 *
 * The clone is a real `next/image` (not a raw `<img>`) at the same `sizes`
 * the card and destination hero use, so it's served from the same cached,
 * optimized derivative instead of a cold, unoptimized fetch of the raw file.
 *
 * The `expand → hold` step and the `HOLD_MIN_MS` floor are driven by our own
 * timers rather than Motion's `onAnimationComplete` racing against real
 * navigation commit — that race is what let fast (e.g. mock-data) navigation
 * skip "hold" outright, making some transitions visibly shorter than others.
 */
export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const reduce = useReducedMotion();

  const [payload, setPayload] = useState<HeroTransitionPayload | null>(null);
  const [stage, setStage] = useState<Stage>("expand");
  const [arrived, setArrived] = useState(false);
  const targetRef = useRef<string | null>(null);
  const holdEnteredAtRef = useRef(0);
  const expandTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panicTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cleanup = useCallback(() => {
    setPayload(null);
    setStage("expand");
    setArrived(false);
    targetRef.current = null;
    document.documentElement.style.overflow = "";
    if (expandTimerRef.current) {
      clearTimeout(expandTimerRef.current);
      expandTimerRef.current = null;
    }
    if (panicTimerRef.current) {
      clearTimeout(panicTimerRef.current);
      panicTimerRef.current = null;
    }
  }, []);

  const begin = useCallback(
    (p: HeroTransitionPayload) => {
      if (reduce) {
        router.push(p.href);
        return;
      }
      targetRef.current = p.href;
      setArrived(false);
      setStage("expand");
      setPayload(p);
      document.documentElement.style.overflow = "hidden";
      router.push(p.href);

      if (expandTimerRef.current) clearTimeout(expandTimerRef.current);
      expandTimerRef.current = setTimeout(() => {
        holdEnteredAtRef.current = Date.now();
        setStage("hold");
      }, dur.cine * 1000);

      // Safety net: never leave the veil stuck if navigation stalls.
      if (panicTimerRef.current) clearTimeout(panicTimerRef.current);
      panicTimerRef.current = setTimeout(() => setStage("out"), PANIC_MS);
    },
    [reduce, router],
  );

  // Mark arrival once the destination route has committed.
  useEffect(() => {
    if (payload && targetRef.current && pathname === targetRef.current) {
      setArrived(true);
    }
  }, [pathname, payload]);

  // Advance out of "hold" only once BOTH the destination has arrived AND the
  // minimum hold time has actually elapsed — so "hold" never gets skipped
  // just because navigation happened to commit before the floor was reached.
  useEffect(() => {
    if (stage !== "hold" || !arrived) return;
    const remaining = HOLD_MIN_MS - (Date.now() - holdEnteredAtRef.current);
    if (remaining <= 0) {
      setStage("out");
      return;
    }
    const id = setTimeout(() => setStage("out"), remaining);
    return () => clearTimeout(id);
  }, [stage, arrived]);

  // Restore scroll if the provider unmounts mid-transition.
  useEffect(
    () => () => {
      document.documentElement.style.overflow = "";
      if (expandTimerRef.current) clearTimeout(expandTimerRef.current);
      if (panicTimerRef.current) clearTimeout(panicTimerRef.current);
    },
    [],
  );

  return (
    <HeroTransitionContext.Provider value={{ begin, active: payload !== null }}>
      {children}
      {payload && (
        <div className="pointer-events-none fixed inset-0 z-[100]" aria-hidden>
          <motion.div
            className="absolute inset-0 bg-cinematic"
            initial={{ opacity: 0 }}
            animate={{ opacity: stage === "out" ? 0 : 0.94 }}
            transition={
              stage === "out"
                ? { duration: dur.base, ease: easeOut, delay: dur.base }
                : { duration: dur.slow, ease: easeOut }
            }
            onAnimationComplete={() => {
              if (stage === "out") cleanup();
            }}
          />
          <motion.div
            className="absolute overflow-hidden"
            initial={{
              top: payload.rect.top,
              left: payload.rect.left,
              width: payload.rect.width,
              height: payload.rect.height,
              borderRadius: 16,
            }}
            animate={
              stage === "out"
                ? { top: 0, left: 0, width: payload.vw, height: payload.vh, borderRadius: 0, opacity: 0 }
                : { top: 0, left: 0, width: payload.vw, height: payload.vh, borderRadius: 0 }
            }
            transition={{ duration: stage === "out" ? dur.base : dur.cine, ease: easeOut }}
          >
            <Image src={payload.src} alt="" fill sizes="100vw" className="object-cover" />
          </motion.div>
        </div>
      )}
    </HeroTransitionContext.Provider>
  );
}
