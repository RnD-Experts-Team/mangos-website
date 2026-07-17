"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { fadeUp, staggerContainer } from "@/lib/motion";
import type { MomentItem } from "@/types/content";

function ArrowIcon({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d={dir === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * A horizontal, scroll-snapping "story strip" — deliberately different from the
 * bar's bento gallery. Captions stay visible; prev/next nudge the rail.
 */
export function MomentsStrip({ moments }: { moments: MomentItem[] }) {
  const railRef = useRef<HTMLDivElement>(null);

  function nudge(dir: "left" | "right") {
    const el = railRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  }

  return (
    <Section id="moments" className="overflow-hidden scroll-mt-20">
      <Container>
        <Reveal className="flex items-end justify-between gap-4">
          <div>
            <p className="text-eyebrow text-xs text-gold">Moments</p>
            <h2 className="mt-2 font-display text-4xl text-ink sm:text-5xl">Off The Flame</h2>
          </div>
          <div className="hidden shrink-0 gap-2 sm:flex">
            {(["left", "right"] as const).map((dir) => (
              <button
                key={dir}
                type="button"
                onClick={() => nudge(dir)}
                aria-label={dir === "left" ? "Scroll left" : "Scroll right"}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-ink-muted transition-colors hover:border-gold/50 hover:text-ink"
              >
                <ArrowIcon dir={dir} />
              </button>
            ))}
          </div>
        </Reveal>
      </Container>

      {/* Full-bleed rail so cards can bleed to the right edge; left inset aligns to the container. */}
      <motion.div
        ref={railRef}
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-4 sm:scroll-px-8 sm:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {moments.map((item, i) => (
          <motion.figure
            key={item.id}
            variants={fadeUp}
            className="group relative aspect-[3/4] w-[72vw] shrink-0 snap-start overflow-hidden rounded-2xl border border-white/10 bg-surface-1 sm:w-[46vw] lg:w-[26rem]"
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="(max-width: 640px) 72vw, (max-width: 1024px) 46vw, 26rem"
              className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.05]"
            />
            <div className="absolute inset-0" style={{ background: "var(--scrim-bottom)" }} />
            <span className="absolute left-4 top-4 font-heading text-xs tabular-nums text-white/70">
              {String(i + 1).padStart(2, "0")} / {String(moments.length).padStart(2, "0")}
            </span>
            {item.caption && (
              <figcaption className="absolute inset-x-0 bottom-0 p-5">
                <p className="font-display text-2xl leading-tight text-white">{item.caption}</p>
              </figcaption>
            )}
          </motion.figure>
        ))}
      </motion.div>
    </Section>
  );
}
