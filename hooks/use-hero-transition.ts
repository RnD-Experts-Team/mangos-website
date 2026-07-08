"use client";

import { createContext, useContext } from "react";

export interface HeroTransitionPayload {
  src: string;
  alt: string;
  href: string;
  /** Card's on-screen rectangle at click time (viewport coords, px). */
  rect: { top: number; left: number; width: number; height: number };
  /** Viewport size captured at click time. */
  vw: number;
  vh: number;
}

export interface HeroTransitionValue {
  begin: (payload: HeroTransitionPayload) => void;
  active: boolean;
}

export const HeroTransitionContext = createContext<HeroTransitionValue | null>(null);

/** Access the hub → business photo-morph controller. */
export function useHeroTransition() {
  const ctx = useContext(HeroTransitionContext);
  if (!ctx) {
    throw new Error("useHeroTransition must be used inside <TransitionProvider>");
  }
  return ctx;
}
