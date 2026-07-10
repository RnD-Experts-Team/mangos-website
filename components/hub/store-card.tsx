"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { useHeroTransition } from "@/hooks/use-hero-transition";
import type { BrandCard } from "@/types/content";
import { cn } from "@/lib/cn";

export function StoreCard({ card }: { card: BrandCard }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const { begin } = useHeroTransition();

  function onClick(e: React.MouseEvent<HTMLAnchorElement>) {
    // Let modified clicks open in a new tab normally.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    const el = ref.current;
    if (!el) return;
    e.preventDefault();
    const r = el.getBoundingClientRect();
    begin({
      src: card.buildingPhoto.src,
      alt: card.buildingPhoto.alt,
      href: card.href,
      rect: { top: r.top, left: r.left, width: r.width, height: r.height },
      vw: window.innerWidth,
      vh: window.innerHeight,
    });
  }

  return (
    <Link
      ref={ref}
      href={card.href}
      onClick={onClick}
      aria-label={`Enter ${card.name}`}
      className={cn(
        "group relative block h-[58vh] min-h-[420px] overflow-hidden rounded-2xl lg:h-[66vh]",
        "ring-1 ring-white/10 transition-shadow duration-500",
        "hover:ring-2 hover:ring-accent/60 focus-visible:ring-2 focus-visible:ring-accent",
      )}
    >
      <Image
        src={card.buildingPhoto.src}
        alt={card.buildingPhoto.alt}
        fill
        priority
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
      />

      {/* Dim (lifts on hover) + bottom scrim for text legibility */}
      <div className="absolute inset-0 bg-black/45 transition-colors duration-500 group-hover:bg-black/25" />
      <div className="absolute inset-0" style={{ background: "var(--scrim-bottom)" }} />

      {card.halal && (
        <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-gold backdrop-blur-sm sm:right-6 sm:top-6">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          Halal Certified
        </span>
      )}

      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
        <p className="text-eyebrow text-[11px] text-white/75">{card.kind}</p>
        <h2 className="mt-2 font-display text-4xl leading-none text-white sm:text-5xl">
          {card.name}
        </h2>
        <p className="mt-2 max-w-sm text-sm text-white/70">{card.blurb}</p>
        <span
          className={cn(
            "mt-4 inline-flex items-center gap-2 font-heading text-sm font-medium uppercase tracking-[0.14em] text-white",
            "opacity-100 transition-all duration-300",
            "lg:translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:group-focus-visible:opacity-100",
          )}
        >
          Enter
          <span className="transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden>
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
