"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { dur, easeOut } from "@/lib/motion";
import { HeroTransitionContext, type HeroTransitionPayload } from "@/hooks/use-hero-transition";

type Stage = "expand" | "hold" | "out";

/**
 * Drives the hub → business photo morph. On `begin`, a copy of the clicked
 * building photo expands from its card rectangle to full-bleed while the route
 * loads; once expanded AND arrived, it fades to reveal the identical hero
 * beneath — so it reads as one continuous image. Reduced motion → plain nav.
 */
export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const reduce = useReducedMotion();

  const [payload, setPayload] = useState<HeroTransitionPayload | null>(null);
  const [stage, setStage] = useState<Stage>("expand");
  const [arrived, setArrived] = useState(false);
  const targetRef = useRef<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cleanup = useCallback(() => {
    setPayload(null);
    setStage("expand");
    setArrived(false);
    targetRef.current = null;
    document.documentElement.style.overflow = "";
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
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
      // Safety net: never leave the veil stuck if navigation stalls.
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setStage("out"), 1800);
    },
    [reduce, router],
  );

  // Mark arrival once the destination route has committed.
  useEffect(() => {
    if (payload && targetRef.current && pathname === targetRef.current) {
      setArrived(true);
    }
  }, [pathname, payload]);

  // Reveal only after the photo has fully expanded AND the page arrived.
  useEffect(() => {
    if (stage === "hold" && arrived) setStage("out");
  }, [stage, arrived]);

  // Restore scroll if the provider unmounts mid-transition.
  useEffect(
    () => () => {
      document.documentElement.style.overflow = "";
      if (timerRef.current) clearTimeout(timerRef.current);
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
            transition={{ duration: stage === "out" ? dur.base : dur.slow, ease: easeOut }}
          />
          <motion.img
            src={payload.src}
            alt=""
            className="absolute object-cover"
            style={{ willChange: "top, left, width, height" }}
            initial={{
              top: payload.rect.top,
              left: payload.rect.left,
              width: payload.rect.width,
              height: payload.rect.height,
              borderRadius: 16,
            }}
            animate={
              stage === "out"
                ? { opacity: 0 }
                : { top: 0, left: 0, width: payload.vw, height: payload.vh, borderRadius: 0 }
            }
            transition={{ duration: stage === "out" ? dur.base : dur.cine, ease: easeOut }}
            onAnimationComplete={() => {
              if (stage === "expand") setStage("hold");
              else if (stage === "out") cleanup();
            }}
          />
        </div>
      )}
    </HeroTransitionContext.Provider>
  );
}
