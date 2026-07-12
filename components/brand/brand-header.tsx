"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Wordmark } from "./wordmark";
import { useScrollCondense } from "@/hooks/use-scroll-condense";
import { dur, easeOut, easeStandard } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * Section links shown in the header — scoped per business route. Only /bar
 * has links today; /grill gets its own set in a later pass (it also runs
 * fully isolated chrome, so it would never read from this map anyway).
 */
const SECTION_LINKS: Record<string, { id: string; label: string }[]> = {
  "/bar": [
    { id: "about", label: "About" },
    { id: "menu", label: "Menu" },
    { id: "moments", label: "Moments" },
  ],
};

/** Highlights whichever section id is currently scrolled into view. */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    if (ids.length === 0) return;
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
    // Re-observe if the route (and thus the section ids) changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join("|")]);

  return active;
}

export function BrandHeader() {
  const condensed = useScrollCondense(56);
  const pathname = usePathname();
  const links = SECTION_LINKS[pathname] ?? [];
  const active = useActiveSection(links.map((l) => l.id));

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
        <Link href="/" aria-label="Mangos — home" className="flex items-center">
          <motion.span
            className="origin-left"
            animate={{ scale: condensed ? 0.86 : 1 }}
            transition={{ duration: dur.base, ease: easeStandard }}
          >
            <Wordmark className="text-3xl" />
          </motion.span>
        </Link>

        {links.length > 0 && (
          <nav
            aria-label="Section navigation"
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 sm:flex"
          >
            {links.map((l) => {
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
                      layoutId="brand-nav-underline"
                      className="absolute inset-x-0 -bottom-px h-0.5 bg-accent"
                      transition={{ duration: dur.base, ease: easeOut }}
                    />
                  )}
                </a>
              );
            })}
          </nav>
        )}

        <span className="hidden text-eyebrow text-[11px] text-ink-faint sm:block">
          Columbus, Ohio
        </span>
      </motion.div>
    </motion.header>
  );
}
