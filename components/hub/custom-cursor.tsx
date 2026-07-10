"use client";

import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { useEffect, useSyncExternalStore } from "react";

function subscribeFinePointer(callback: () => void) {
  const mq = window.matchMedia("(pointer: fine)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}
function getFinePointerSnapshot() {
  return window.matchMedia("(pointer: fine)").matches;
}
function getFinePointerServerSnapshot() {
  return false;
}

/**
 * A small pinkish dot that follows the mouse with a light spring lag. Only
 * mounts on fine-pointer (mouse) devices — touch is left untouched. Hides the
 * native cursor by injecting a fresh <style> tag directly at runtime (rather
 * than relying on a class + stylesheet rule), so it can't be shadowed by
 * Tailwind's cascade layers or a stale CSS bundle — this always wins because
 * it's a plain unlayered `!important` rule appended after everything else.
 */
export function CustomCursor() {
  const reduce = useReducedMotion();
  const enabled = useSyncExternalStore(
    subscribeFinePointer,
    getFinePointerSnapshot,
    getFinePointerServerSnapshot,
  );
  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  const spring = reduce ? { stiffness: 1000, damping: 50 } : { stiffness: 500, damping: 34 };
  const x = useSpring(mx, spring);
  const y = useSpring(my, spring);

  useEffect(() => {
    if (!enabled) return;

    const style = document.createElement("style");
    style.textContent = "* { cursor: none !important; }";
    document.head.appendChild(style);

    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.head.removeChild(style);
    };
  }, [enabled, mx, my]);

  if (!enabled) return null;

  return (
    <motion.span
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[200] h-2.5 w-2.5 rounded-full bg-accent"
      style={{ x, y, translateX: "-50%", translateY: "-50%" }}
    />
  );
}
