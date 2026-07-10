"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Lightbox } from "@/components/ui/lightbox";
import { staggerContainer, fadeUp } from "@/lib/motion";
import type { MomentItem } from "@/types/content";
import { cn } from "@/lib/cn";

/** Bento spans — a couple of feature tiles among smaller ones. `grid-flow-dense` packs gaps. */
const SPANS = [
  "col-span-2 row-span-2",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-2",
  "col-span-1 row-span-1",
  "col-span-2 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
];

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
          sizes="(max-width: 1024px) 50vw, 25vw"
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

/** Bento-grid gallery; tap a tile to open the full-screen viewer with swipe/arrow paging. */
export function MomentsGallery({ moments }: { moments: MomentItem[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const active = index !== null ? moments[index] : null;

  return (
    <Section>
      <Container>
        <Reveal>
          <p className="text-eyebrow text-xs text-ink-faint">Moments</p>
          <h2 className="mt-2 font-display text-4xl text-ink sm:text-5xl">Nights At Mangos</h2>
        </Reveal>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-10 grid auto-rows-[150px] grid-cols-2 gap-3 [grid-auto-flow:dense] sm:auto-rows-[180px] lg:grid-cols-4"
        >
          {moments.map((item, i) => (
            <MomentTile
              key={item.id}
              item={item}
              span={SPANS[i % SPANS.length]}
              onOpen={() => setIndex(i)}
            />
          ))}
        </motion.div>
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
