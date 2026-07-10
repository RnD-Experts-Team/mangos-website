"use client";

import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import { springHero, dur, easeOut } from "@/lib/motion";

export interface LightboxItem {
  id: string;
  type: "image" | "video";
  src: string;
  alt: string;
  poster?: string;
  caption?: string;
}

/**
 * Generic full-screen viewer: focus-trap, Escape to close, scroll-lock, and
 * focus restored to the trigger on close. No headless-dialog dependency —
 * small enough to hand-roll and keep the dependency list minimal. A plain
 * scale/fade entrance (the opening tile stays mounted underneath, so a shared
 * `layoutId` FLIP between two live elements isn't safe here).
 */
export function Lightbox({
  item,
  onClose,
  onPrev,
  onNext,
}: {
  item: LightboxItem | null;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<Element | null>(null);
  const swipeStartX = useRef<number | null>(null);

  useEffect(() => {
    if (!item) return;
    triggerRef.current = document.activeElement;
    document.documentElement.style.overflow = "hidden";
    panelRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") return onClose();
      if (e.key === "ArrowLeft" && onPrev) onPrev();
      if (e.key === "ArrowRight" && onNext) onNext();
      if (e.key === "Tab") {
        const root = panelRef.current?.parentElement;
        const focusables = root?.querySelectorAll<HTMLElement>(
          'a[href], button, [tabindex]:not([tabindex="-1"])',
        );
        if (!focusables || focusables.length === 0) return;
        const list = Array.from(focusables);
        const first = list[0];
        const last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.documentElement.style.overflow = "";
      if (triggerRef.current instanceof HTMLElement) triggerRef.current.focus();
    };
  }, [item, onClose, onPrev, onNext]);

  function onPointerDown(e: React.PointerEvent) {
    swipeStartX.current = e.clientX;
  }
  function onPointerUp(e: React.PointerEvent) {
    if (swipeStartX.current === null) return;
    const dx = e.clientX - swipeStartX.current;
    swipeStartX.current = null;
    const threshold = 60;
    if (dx < -threshold && onNext) onNext();
    else if (dx > threshold && onPrev) onPrev();
  }

  if (!item) return null;

  return (
    <>
        <motion.div
          className="fixed inset-0 z-[150] flex items-center justify-center bg-cinematic/95 p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: dur.base, ease: easeOut }}
          onClick={onClose}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={item.caption ?? item.alt}
            tabIndex={-1}
            className="relative max-h-full max-w-4xl outline-none"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={springHero}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
          >
            {item.type === "video" ? (
              <video
                src={item.src}
                poster={item.poster}
                controls
                autoPlay
                className="max-h-[85vh] w-auto rounded-lg"
              />
            ) : (
              // Arbitrary/unknown source aspect ratio, must size natively within
              // max-h-[85vh]; next/image needs known dimensions or a pre-sized
              // container, neither fits here.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.src}
                alt={item.alt}
                draggable={false}
                className="max-h-[85vh] w-auto rounded-lg object-contain"
              />
            )}
            {item.caption && (
              <p className="mt-3 text-center text-sm text-ink-muted">{item.caption}</p>
            )}
          </motion.div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-ink transition-colors hover:border-white/40"
          >
            ✕
          </button>
          {onPrev && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              aria-label="Previous"
              className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 text-ink transition-colors hover:border-white/40 sm:left-6"
            >
              ‹
            </button>
          )}
          {onNext && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              aria-label="Next"
              className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 text-ink transition-colors hover:border-white/40 sm:right-6"
            >
              ›
            </button>
          )}
        </motion.div>
    </>
  );
}
