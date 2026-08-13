"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { useRef } from "react";
import { useHeroTransition } from "@/hooks/use-hero-transition";
import { useMapsHref } from "@/hooks/use-maps-href";
import { staggerContainer, fadeUpSm } from "@/lib/motion";
import type { Address, BrandCard } from "@/types/content";
import { cn } from "@/lib/cn";

function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function PinIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden className="text-white/70">
      <path d="M12 21s6.5-6 6.5-11A6.5 6.5 0 0 0 5.5 10c0 5 6.5 11 6.5 11Z" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="9.5" r="2.2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden className="text-white/70">
      <path
        fill="currentColor"
        d="M6.6 10.8a15.4 15.4 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24c.97.32 2 .48 3 .48a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.6 21 3 13.4 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1 .16 2.03.48 3a1 1 0 0 1-.24 1.02L6.6 10.8Z"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden className="text-white/70">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 7l7.2 5.4a1.3 1.3 0 0 0 1.6 0L20 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function StoreCard({
  card,
  address,
  phone,
  email,
}: {
  card: BrandCard;
  address: Address;
  phone: string;
  email: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const { begin } = useHeroTransition();
  const mapsHref = useMapsHref(address);

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
    <div
      className={cn(
        "group relative h-[64vh] min-h-[460px] overflow-hidden rounded-2xl border-2 border-accent lg:h-[74vh]",
        "transition-all duration-500 ease-out",
        "hover:shadow-[0_0_40px_rgba(196,33,47,0.55)] focus-within:shadow-[0_0_40px_rgba(196,33,47,0.55)]",
      )}
    >
      <Image
        src={card.buildingPhoto.src}
        alt={card.buildingPhoto.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover brightness-100 transition-all duration-[900ms] ease-out group-hover:scale-[1.05] group-hover:brightness-125"
      />

      {/* Bottom scrim handles text legibility; no separate dim overlay by default */}
      <div className="absolute inset-0" style={{ background: "var(--scrim-bottom)" }} />

      {card.halal && (
        <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-gold backdrop-blur-sm sm:right-6 sm:top-6">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          Halal Certified
        </span>
      )}

      <motion.div
        variants={staggerContainer}
        className="absolute inset-x-0 bottom-0 p-6 sm:p-8"
      >
        <motion.p variants={fadeUpSm} className="text-eyebrow text-[11px] text-white/75">
          {card.kind}
        </motion.p>
        <motion.h2
          variants={fadeUpSm}
          className="mt-2 font-display text-4xl leading-none text-white sm:text-5xl"
        >
          {card.name}
        </motion.h2>
        <motion.p variants={fadeUpSm} className="mt-2 max-w-sm text-sm text-white/70">
          {card.blurb}
        </motion.p>

        <motion.div
          variants={fadeUpSm}
          className="relative z-20 mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-white/70"
        >
          <a
            href={mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
          >
            <PinIcon />
            {address.line1}, {address.city}
          </a>
          <a href={telHref(phone)} className="inline-flex items-center gap-1.5 transition-colors hover:text-white">
            <PhoneIcon />
            {phone}
          </a>
          <a href={`mailto:${email}`} className="inline-flex items-center gap-1.5 transition-colors hover:text-white">
            <MailIcon />
            Email
          </a>
        </motion.div>

        <span
          className={cn(
            "mt-4 inline-flex items-center gap-2 font-heading text-sm font-medium uppercase tracking-[0.14em] text-white",
            "opacity-100 transition-all duration-300",
            "lg:translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100",
          )}
        >
          Enter
          <span className="transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden>
            →
          </span>
        </span>
      </motion.div>

      <Link
        ref={ref}
        href={card.href}
        onClick={onClick}
        aria-label={`Enter ${card.name}`}
        className="absolute inset-0 z-10"
      />
    </div>
  );
}
