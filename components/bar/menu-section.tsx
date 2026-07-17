"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { ProductDialog } from "@/components/bar/product-dialog";
import { dur, easeOut, staggerContainer, fadeUp } from "@/lib/motion";
import type { MenuCategory, MenuItem } from "@/types/content";
import { cn } from "@/lib/cn";

export function MenuSection({ categories }: { categories: MenuCategory[] }) {
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState<MenuItem | null>(null);
  const category = categories[active];
  const hasMock = categories.some((c) => c.items.some((i) => i.mock));

  return (
    <Section id="menu" className="scroll-mt-28 pt-0 sm:pt-0">
      <Container>
        <p className="text-eyebrow text-xs text-ink-faint">What&apos;s Pouring</p>
        <h2 className="mt-2 font-display text-4xl text-ink sm:text-5xl">The Menu</h2>
        {hasMock && (
          <p className="mt-3 text-xs text-ink-faint">
            Sample menu — items, prices &amp; photos are placeholders, full menu coming soon.
          </p>
        )}

        {/* Tabs */}
        <div
          role="tablist"
          aria-label="Menu categories"
          className="mt-8 flex flex-wrap gap-x-1 border-b border-white/10"
        >
          {categories.map((cat, i) => {
            const selectedTab = i === active;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={selectedTab}
                onClick={() => setActive(i)}
                className={cn(
                  "relative px-4 py-3 font-heading text-sm uppercase tracking-[0.1em] transition-colors",
                  selectedTab ? "text-ink" : "text-ink-faint hover:text-ink-muted",
                )}
              >
                {cat.tabLabel ?? cat.title}
                {selectedTab && (
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

        {/* Keyed so the intro + rows re-mount and re-play on tab change. */}
        <motion.div
          key={category.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: dur.base, ease: easeOut }}
          className="mt-8"
        >
          <p className="max-w-prose text-base leading-relaxed text-ink-muted">{category.intro}</p>

          {/* Rows slide up in a soft stagger as they enter the viewport. */}
          <motion.ul
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="mt-6 grid gap-x-10 sm:grid-cols-2"
          >
            {category.items.map((item) => (
              <motion.li key={item.id} variants={fadeUp}>
                <button
                  type="button"
                  onClick={() => setSelected(item)}
                  className="group flex w-full cursor-pointer items-center gap-4 border-b border-white/[0.07] py-3.5 text-left transition-colors hover:border-white/20"
                >
                  {item.image && (
                    <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-white/10">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                      />
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block font-heading text-base text-ink transition-colors group-hover:text-white">
                      {item.name}
                    </span>
                    {item.description && (
                      <span className="mt-0.5 block text-sm text-ink-muted">{item.description}</span>
                    )}
                  </span>
                  {item.price && (
                    <span className="shrink-0 font-heading text-base tabular-nums text-ink">
                      {item.price}
                    </span>
                  )}
                </button>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </Container>

      {selected && (
        <ProductDialog key={selected.id} item={selected} onClose={() => setSelected(null)} />
      )}
    </Section>
  );
}
