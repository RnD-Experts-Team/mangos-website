"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Wordmark } from "@/components/brand/wordmark";
import { Container } from "@/components/ui/container";
import { useScrollCondense } from "@/hooks/use-scroll-condense";
import { dur, easeOut, easeStandard } from "@/lib/motion";
import { cn } from "@/lib/cn";
import type { Grill } from "@/types/content";

const SECTION_LINKS = [
  { id: "about", label: "About" },
  { id: "menu", label: "Menu" },
  { id: "build-a-bowl", label: "Your Bowl" },
  { id: "moments", label: "Moments" },
];

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const targets = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        const topmost = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b,
        );
        setActive(topmost.target.id);
      },
      { rootMargin: "-120px 0px -70% 0px", threshold: 0 },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join("|")]);

  return active;
}

export function GrillHeader() {
  const condensed = useScrollCondense(56);
  const active = useActiveSection(SECTION_LINKS.map((l) => l.id));

  return (
    <motion.header
      className={cn("fixed inset-x-0 top-0 z-50 border-b", condensed && "backdrop-blur-md")}
      animate={{
        backgroundColor: condensed ? "rgba(10,10,11,0.72)" : "rgba(10,10,11,0)",
        borderBottomColor: condensed ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0)",
      }}
      transition={{ duration: dur.base, ease: easeStandard }}
    >
      <motion.div
        className="relative mx-auto flex max-w-6xl items-center justify-between px-5 sm:px-8"
        animate={{ height: condensed ? 62 : 82 }}
        transition={{ duration: dur.base, ease: easeStandard }}
      >
        <Link
          href="/grill"
          aria-label="Mangos Mediterranean Grill — home"
          className="flex items-baseline gap-2.5"
        >
          <motion.span
            className="origin-left"
            animate={{ scale: condensed ? 0.86 : 1 }}
            transition={{ duration: dur.base, ease: easeStandard }}
          >
            <Wordmark className="text-2xl" />
          </motion.span>
          <span className="hidden text-eyebrow text-[10px] text-ink-faint sm:block">
            Mediterranean Grill
          </span>
        </Link>

        <nav
          aria-label="Section navigation"
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 sm:flex"
        >
          {SECTION_LINKS.map((l) => {
            const isActive = active === l.id;
            return (
              <a
                key={l.id}
                href={`#${l.id}`}
                className={cn(
                  "relative py-1 font-heading text-xs uppercase tracking-[0.14em] transition-colors",
                  isActive ? "text-ink" : "text-ink-faint hover:text-ink-muted",
                )}
              >
                {l.label}
                {isActive && (
                  <motion.span
                    layoutId="grill-nav-underline"
                    className="absolute inset-x-0 -bottom-px h-0.5 bg-accent"
                    transition={{ duration: dur.base, ease: easeOut }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-gold">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          Halal Certified
        </span>
      </motion.div>
    </motion.header>
  );
}

export function GrillFooter({ grill }: { grill: Grill }) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/10 bg-cinematic">
      <Container className="flex flex-col items-center gap-3 py-10 text-center">
        <Wordmark className="text-xl" />
        <p className="text-xs text-ink-faint">
          {grill.address.line1}, {grill.address.city}, {grill.address.state} · {grill.contact.phone}
        </p>
        <p className="text-xs text-ink-faint">© {year} Mangos Mediterranean Grill</p>
      </Container>
    </footer>
  );
}
