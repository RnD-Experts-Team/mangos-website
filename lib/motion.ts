import type { Variants, Transition } from "motion/react";

/** Durations in seconds (Motion uses seconds; CSS mirror is in globals.css). */
export const dur = { fast: 0.15, base: 0.24, slow: 0.42, cine: 0.64 } as const;

/** Easing curves. */
export const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const easeStandard: [number, number, number, number] = [0.4, 0, 0.2, 1];
export const easeInOut: [number, number, number, number] = [0.65, 0, 0.35, 1];

/** Springs. */
export const springUI: Transition = { type: "spring", stiffness: 260, damping: 30 };
export const springHero: Transition = { type: "spring", stiffness: 140, damping: 22, mass: 1.1 };

/** Stagger container for on-load / scroll reveals. */
export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

/** Standard fade-up child. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: dur.slow, ease: easeOut } },
};

/** Subtler fade-up for dense lists. */
export const fadeUpSm: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: dur.base, ease: easeOut } },
};
