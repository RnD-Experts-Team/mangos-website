"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Lightbox } from "@/components/ui/lightbox";
import { dur, easeOut, staggerContainer, fadeUp } from "@/lib/motion";
import type { MomentItem } from "@/types/content";
import { cn } from "@/lib/cn";

/**
 * Three bento arrangements the wall slides through, laid out side by side in
 * one continuous track (see `MomentsGallery`) rather than swapped in place —
 * that's what makes the transition read as sliding to the next set instead of
 * a cross-fade. Each page is 5 tiles whose spans sum to exactly 8 cells — the
 * capacity of the 4-column × 2-row desktop grid — so no page ever spills onto
 * a third row. Spans are `lg:`-only, so below `lg` every tile is a plain 1x1;
 * the 5th is hidden there, leaving 4 tiles in 2 columns, also exactly 2 rows.
 *
 * `offset` is where each page starts reading from `moments`. With 8 photos and
 * 5 slots some overlap between pages is unavoidable — fine while the photos
 * are mock placeholders.
 */
const PAGES = [
  // 4+1+1+1+1 — feature left
  { offset: 0, spans: ["lg:col-span-2 lg:row-span-2", "", "", "", "hidden lg:block"] },
  // 1+1+4+1+1 — feature right
  { offset: 3, spans: ["", "", "lg:col-span-2 lg:row-span-2", "", "hidden lg:block"] },
  // 2+2+2+1+1 — twin towers
  { offset: 6, spans: ["lg:row-span-2", "lg:row-span-2", "lg:col-span-2", "", "hidden lg:block"] },
];

const ROTATE_MS = 3000;

function MomentVideoPreview({ item }: { item: MomentItem }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={item.src}
      poster={item.poster}
      muted
      loop
      playsInline
      className="h-full w-full object-cover"
    />
  );
}

function MomentTile({
  item,
  span,
  onOpen,
}: {
  item: MomentItem;
  span: string;
  onOpen: () => void;
}) {
  return (
    <motion.button
      type="button"
      variants={fadeUp}
      onClick={onOpen}
      aria-label={item.caption ?? item.alt}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-white/10 bg-surface-1",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        span,
      )}
    >
      {item.type === "video" ? (
        <MomentVideoPreview item={item} />
      ) : (
        <Image
          src={item.src}
          alt={item.alt}
          fill
          sizes="(max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.06]"
        />
      )}
      <div className="absolute inset-0 bg-black/15 transition-colors duration-500 group-hover:bg-black/0" />
      {item.caption && (
        <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 p-4 text-left text-sm text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
          style={{ background: "var(--scrim-bottom)" }}
        >
          {item.caption}
        </span>
      )}
    </motion.button>
  );
}

/**
 * Sliding wall: all three bento arrangements sit side by side in one track,
 * and the track's own `x` transform animates between them — a genuine slide,
 * not a swap-in-place. Tap a tile to open the full-screen viewer with
 * swipe/arrow paging over every photo.
 */
export function MomentsGallery({ moments }: { moments: MomentItem[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const active = index !== null ? moments[index] : null;

  // Only slide while the wall is actually on screen.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.2,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /*
   * The effect's own cleanup clears the interval, and the dep list re-arms it —
   * so each pause reason simply stops the timer and resuming starts a fresh
   * 3s. The reduced-motion check is mandatory: the app-wide MotionConfig
   * strips animations but has no effect on a JS timer.
   */
  useEffect(() => {
    if (reduce || paused || !inView || index !== null) return;
    const id = setInterval(() => setPage((p) => (p + 1) % PAGES.length), ROTATE_MS);
    return () => clearInterval(id);
  }, [reduce, paused, inView, index]);

  if (moments.length === 0) return null;

  return (
    <Section id="moments" className="scroll-mt-28 pt-0 sm:pt-0">
      <Container>
        <Reveal>
          <p className="text-eyebrow text-xs text-ink-faint">Moments</p>
          <h2 className="mt-2 font-display text-4xl text-ink sm:text-5xl">Nights At Mangos</h2>
        </Reveal>

        <div
          ref={wrapRef}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
          className="mt-10 overflow-hidden rounded-2xl"
        >
          {/* Single persistent track — pages slide via `x`, never remount. */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            animate={{ x: `-${page * 100}%` }}
            transition={{ duration: dur.slow, ease: easeOut }}
            className="flex"
          >
            {PAGES.map(({ offset, spans }, pageIndex) => (
              <div
                key={pageIndex}
                className="grid w-full shrink-0 auto-rows-[150px] grid-cols-2 gap-3 [grid-auto-flow:dense] sm:auto-rows-[180px] lg:grid-cols-4"
              >
                {spans.map((span, i) => {
                  const abs = (offset + i) % moments.length;
                  return (
                    <MomentTile
                      key={`${pageIndex}-${abs}-${i}`}
                      item={moments[abs]}
                      span={span}
                      onOpen={() => setIndex(abs)}
                    />
                  );
                })}
              </div>
            ))}
          </motion.div>

          <div
            role="group"
            aria-label="Photo sets"
            className="mt-6 flex items-center justify-center gap-2"
          >
            {PAGES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPage(i)}
                aria-label={`Show photo set ${i + 1}`}
                aria-current={i === page}
                className="group flex h-6 min-w-6 cursor-pointer items-center justify-center"
              >
                <span
                  className={cn(
                    "block h-2 rounded-full transition-all duration-300",
                    i === page ? "w-6 bg-accent" : "w-2 bg-white/25 group-hover:bg-white/50",
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      </Container>

      <Lightbox
        item={active}
        onClose={() => setIndex(null)}
        onPrev={index !== null ? () => setIndex((index - 1 + moments.length) % moments.length) : undefined}
        onNext={index !== null ? () => setIndex((index + 1) % moments.length) : undefined}
      />
    </Section>
  );
}
