"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { dur, easeOut } from "@/lib/motion";
import type { MenuCategory } from "@/types/content";
import { cn } from "@/lib/cn";

export function MenuSection({ categories }: { categories: MenuCategory[] }) {
  const [active, setActive] = useState(0);
  const category = categories[active];
  const hasMock = categories.some((c) => c.items.some((i) => i.mock));

  return (
    <Section id="menu">
      <Container>
        <p className="text-eyebrow text-xs text-ink-faint">What&apos;s Pouring</p>
        <h2 className="mt-2 font-display text-4xl text-ink sm:text-5xl">The Menu</h2>
        {hasMock && (
          <p className="mt-3 text-xs text-ink-faint">
            Sample menu — items &amp; prices are placeholders, full menu coming soon.
          </p>
        )}

        {/* Tabs */}
        <div
          role="tablist"
          aria-label="Menu categories"
          className="mt-8 flex flex-wrap gap-x-1 border-b border-white/10"
        >
          {categories.map((cat, i) => {
            const selected = i === active;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActive(i)}
                className={cn(
                  "relative px-4 py-3 font-heading text-sm uppercase tracking-[0.1em] transition-colors",
                  selected ? "text-ink" : "text-ink-faint hover:text-ink-muted",
                )}
              >
                {cat.tabLabel ?? cat.title}
                {selected && (
                  <motion.span
                    layoutId="menu-tab-underline"
                    className="absolute inset-x-0 -bottom-px h-0.5 bg-accent"
                    transition={{ duration: dur.base, ease: easeOut }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Active category panel — keyed so it re-mounts and re-plays its entrance on tab change. */}
        <motion.div
          key={category.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: dur.base, ease: easeOut }}
          className="mt-8"
        >
          <p className="max-w-prose text-base leading-relaxed text-ink-muted">{category.intro}</p>

          <div className="mt-6 grid gap-x-12 sm:grid-cols-2">
            {category.items.map((item) => (
              <div
                key={item.name}
                className="flex items-baseline justify-between gap-4 border-b border-white/[0.07] py-3.5"
              >
                <div className="min-w-0">
                  <p className="font-heading text-base text-ink">{item.name}</p>
                  {item.description && (
                    <p className="mt-0.5 text-sm text-ink-muted">{item.description}</p>
                  )}
                </div>
                {item.price && (
                  <span className="shrink-0 font-heading text-base tabular-nums text-accent">
                    {item.price}
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}
