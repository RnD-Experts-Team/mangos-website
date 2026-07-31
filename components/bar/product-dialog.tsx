"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { springHero, dur, easeOut } from "@/lib/motion";
import type { MenuItem } from "@/types/content";
import { cn } from "@/lib/cn";

/**
 * Product detail dialog: a bigger photo with a thumbnail strip, plus name,
 * price, description and details. Hand-rolled a11y (focus-trap, Escape,
 * scroll-lock, focus-restore); mount only when `item` is set (deterministic
 * unmount). Parent should key it by item id so photo state resets per open.
 */
export function ProductDialog({ item, onClose }: { item: MenuItem; onClose: () => void }) {
  const photos = [item.image, ...(item.gallery ?? [])].filter(Boolean) as string[];
  const [active, setActive] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<Element | null>(null);

  useEffect(() => {
    triggerRef.current = document.activeElement;
    document.documentElement.style.overflow = "hidden";
    panelRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") return onClose();
      if (e.key === "Tab") {
        const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
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
  }, [onClose]);

  return (
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
        aria-label={item.name}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={springHero}
        className="relative grid w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-surface-1 outline-none sm:grid-cols-2"
      >
        {/* Photo side */}
        <div className="p-4 sm:p-5">
          <div className="relative aspect-square overflow-hidden rounded-xl border border-white/10">
            {photos[active] && (
              <Image
                key={photos[active]}
                src={photos[active]}
                alt={item.name}
                fill
                sizes="(max-width: 640px) 90vw, 40vw"
                className="object-cover"
              />
            )}
          </div>
          {photos.length > 1 && (
            <div className="mt-3 flex gap-2">
              {photos.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`View photo ${i + 1}`}
                  className={cn(
                    "relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border transition-colors",
                    i === active ? "border-accent" : "border-white/10 hover:border-white/30",
                  )}
                >
                  <Image src={src} alt="" fill sizes="56px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info side */}
        <div className="flex flex-col p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-display text-3xl leading-none text-ink">{item.name}</h3>
            <div className="flex shrink-0 items-center gap-3">
              {item.price && (
                <span className="font-heading text-lg tabular-nums text-ink">{item.price}</span>
              )}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex h-7 w-7 items-center justify-center rounded-full text-ink-faint transition-colors hover:text-ink"
              >
                ✕
              </button>
            </div>
          </div>
          {item.description && (
            <p className="mt-3 text-sm font-medium text-accent">{item.description}</p>
          )}
          {item.tags && item.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-surface-2 px-2.5 py-0.5 text-xs text-ink-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          {item.details && (
            <p className="mt-4 text-base leading-relaxed text-ink-muted">{item.details}</p>
          )}
        </div>

      </motion.div>
    </motion.div>
  );
}
