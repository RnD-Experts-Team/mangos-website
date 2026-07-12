"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { dur, easeOut, fadeUp, staggerContainer } from "@/lib/motion";
import type { BowlBuilder, BowlOption, BowlStep } from "@/types/content";
import { cn } from "@/lib/cn";

/** Parse a leading-dollar display price ("$12", "+$4") to a number; 0 if none. */
function toAmount(price?: string) {
  if (!price) return 0;
  const n = Number(price.replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function OptionCard({
  option,
  selected,
  multi,
  onSelect,
}: {
  option: BowlOption;
  selected: boolean;
  multi: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      type="button"
      variants={fadeUp}
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border bg-surface-1 text-left transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        selected ? "border-gold" : "border-white/10 hover:border-white/25",
      )}
    >
      <span className="relative block aspect-[4/3] overflow-hidden">
        {option.image && (
          <Image
            src={option.image}
            alt={option.name}
            fill
            sizes="(max-width: 640px) 45vw, 180px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        )}
        <span
          aria-hidden
          className={cn(
            "absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full border text-white transition-all",
            multi ? "rounded-md" : "rounded-full",
            selected
              ? "border-gold bg-gold text-cinematic"
              : "border-white/40 bg-black/30 opacity-0 group-hover:opacity-100",
          )}
        >
          <CheckIcon />
        </span>
      </span>
      <span className="flex flex-1 items-start justify-between gap-2 px-3 py-2.5">
        <span className="min-w-0">
          <span className="block truncate font-heading text-sm text-ink">{option.name}</span>
          {option.description && (
            <span className="mt-0.5 block truncate text-xs text-ink-faint">{option.description}</span>
          )}
        </span>
        {option.price && (
          <span className="shrink-0 font-heading text-xs tabular-nums text-gold">{option.price}</span>
        )}
      </span>
    </motion.button>
  );
}

/** One tab in the stepper: index/check badge, title, and a live preview of the pick. */
function StepTab({
  step,
  index,
  active,
  selectedNames,
  onSelect,
}: {
  step: BowlStep;
  index: number;
  active: boolean;
  selectedNames: string[];
  onSelect: () => void;
}) {
  const complete = selectedNames.length > 0;
  return (
    <button
      type="button"
      role="tab"
      id={`bowl-tab-${step.id}`}
      aria-selected={active}
      aria-controls={`bowl-panel-${step.id}`}
      onClick={onSelect}
      className={cn(
        "group flex min-w-[7.5rem] flex-1 flex-col items-start gap-2 border-b-2 pb-3 pt-1 text-left transition-colors sm:min-w-[9rem]",
        active ? "border-gold" : complete ? "border-gold/35" : "border-white/10 hover:border-white/25",
      )}
    >
      <span className="flex w-full items-center gap-2">
        <span
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium tabular-nums transition-colors",
            complete
              ? "border-gold bg-gold text-cinematic"
              : active
                ? "border-gold text-gold"
                : "border-white/25 text-ink-faint group-hover:border-white/40",
          )}
        >
          {complete ? <CheckIcon /> : index + 1}
        </span>
        <span
          className={cn(
            "min-w-0 flex-1 truncate font-heading text-xs uppercase tracking-[0.1em] transition-colors",
            active ? "text-ink" : complete ? "text-ink-muted" : "text-ink-faint group-hover:text-ink-muted",
          )}
        >
          {step.title.replace(/^Choose your /i, "")}
        </span>
      </span>
      <span className="min-h-[1rem] w-full truncate text-xs text-gold">
        {selectedNames.length ? selectedNames.join(", ") : " "}
      </span>
    </button>
  );
}

export function BowlBuilderSection({ bowl }: { bowl: BowlBuilder }) {
  const [activeIndex, setActiveIndex] = useState(0);
  // One entry per step: an array of chosen option ids (≤1 for single-select).
  const [choices, setChoices] = useState<Record<string, string[]>>({});
  const advanceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (advanceTimeout.current) clearTimeout(advanceTimeout.current);
    };
  }, []);

  const step = bowl.steps[activeIndex];

  function select(stepIndex: number, targetStep: BowlStep, optionId: string) {
    const current = choices[targetStep.id] ?? [];
    const wasSelected = current.includes(optionId);

    setChoices((prev) => {
      const prevCurrent = prev[targetStep.id] ?? [];
      if (targetStep.multi) {
        const next = prevCurrent.includes(optionId)
          ? prevCurrent.filter((id) => id !== optionId)
          : [...prevCurrent, optionId];
        return { ...prev, [targetStep.id]: next };
      }
      // Single-select: tapping the chosen one clears it, else replace.
      return { ...prev, [targetStep.id]: prevCurrent[0] === optionId ? [] : [optionId] };
    });

    // Freshly picking a single-select option glides to the next step so
    // progress reads left-to-right; re-tapping to clear stays put.
    if (!targetStep.multi && !wasSelected && stepIndex < bowl.steps.length - 1) {
      if (advanceTimeout.current) clearTimeout(advanceTimeout.current);
      advanceTimeout.current = setTimeout(() => setActiveIndex(stepIndex + 1), 260);
    }
  }

  const optionById = useMemo(() => {
    const map: Record<string, BowlOption> = {};
    for (const s of bowl.steps) for (const o of s.options) map[o.id] = o;
    return map;
  }, [bowl.steps]);

  const chosen = bowl.steps.map((s) => ({
    step: s,
    options: (choices[s.id] ?? []).map((id) => optionById[id]).filter(Boolean),
  }));

  const total =
    toAmount(bowl.basePrice) +
    chosen.reduce((sum, { options }) => sum + options.reduce((s, o) => s + toAmount(o.price), 0), 0);

  const requiredSteps = bowl.steps.filter((s) => !s.multi);
  const completedRequired = requiredSteps.filter((s) => (choices[s.id]?.length ?? 0) > 0).length;
  const ready = completedRequired === requiredSteps.length;
  const isLastStep = activeIndex === bowl.steps.length - 1;

  return (
    <Section id="build-a-bowl" className="border-y border-white/10 bg-surface-1/40">
      <Container>
        <Reveal>
          <p className="text-eyebrow text-xs text-gold">{bowl.eyebrow}</p>
          <h2 className="mt-2 font-display text-4xl text-ink sm:text-5xl">{bowl.title}</h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted">{bowl.intro}</p>
        </Reveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_20rem] lg:items-start lg:gap-12">
          <div>
            {/* Stepper tabs — tap any step to jump straight to it and change your pick. */}
            <div role="tablist" aria-label="Bowl steps" className="flex gap-2 overflow-x-auto sm:gap-3">
              {bowl.steps.map((s, i) => (
                <StepTab
                  key={s.id}
                  step={s}
                  index={i}
                  active={i === activeIndex}
                  selectedNames={(choices[s.id] ?? []).map((id) => optionById[id]?.name).filter(Boolean) as string[]}
                  onSelect={() => setActiveIndex(i)}
                />
              ))}
            </div>

            {/* Active step's options — crossfades in as the tab changes. */}
            <motion.div
              key={step.id}
              id={`bowl-panel-${step.id}`}
              role="tabpanel"
              aria-labelledby={`bowl-tab-${step.id}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: dur.base, ease: easeOut }}
              className="mt-6"
            >
              {step.hint && <p className="text-xs text-ink-faint">{step.hint}</p>}

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3"
              >
                {step.options.map((option) => (
                  <OptionCard
                    key={option.id}
                    option={option}
                    multi={!!step.multi}
                    selected={(choices[step.id] ?? []).includes(option.id)}
                    onSelect={() => select(activeIndex, step, option.id)}
                  />
                ))}
              </motion.div>

              {!isLastStep && (
                <button
                  type="button"
                  onClick={() => setActiveIndex(activeIndex + 1)}
                  className="mt-5 inline-flex items-center gap-1.5 font-heading text-xs uppercase tracking-[0.1em] text-ink-faint transition-colors hover:text-ink"
                >
                  Skip / Next step
                  <span aria-hidden>→</span>
                </button>
              )}
            </motion.div>
          </div>

          {/* Sticky summary */}
          <aside className="min-w-0 lg:sticky lg:top-24">
            <div className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-base p-5 shadow-[var(--shadow-2)] sm:p-6">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="min-w-0 truncate font-display text-2xl text-ink">Your Bowl</h3>
                <span className="shrink-0 font-heading text-xl tabular-nums text-gold">${total}</span>
              </div>

              <ul className="mt-4 flex min-w-0 flex-col gap-1 text-sm">
                {chosen.map(({ step: s, options }, i) => (
                  <li key={s.id} className="min-w-0">
                    <button
                      type="button"
                      onClick={() => setActiveIndex(i)}
                      className={cn(
                        "flex w-full min-w-0 items-start justify-between gap-3 rounded-md px-2 py-1.5 text-left transition-colors",
                        i === activeIndex ? "bg-white/[0.06]" : "hover:bg-white/[0.04]",
                      )}
                    >
                      <span className="shrink-0 font-heading text-[11px] uppercase tracking-[0.12em] text-ink-faint">
                        {s.title.replace(/^Choose your /i, "")}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-right text-ink">
                        {options.length ? options.map((o) => o.name).join(", ") : <span className="text-ink-faint">—</span>}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              <div
                className={cn(
                  "mt-5 rounded-lg border px-4 py-3 text-center text-sm transition-colors",
                  ready ? "border-gold/40 bg-gold/10 text-gold" : "border-white/10 bg-surface-1 text-ink-faint",
                )}
              >
                {ready
                  ? "Your bowl is ready — order at the counter."
                  : `Pick a base, protein & spread to finish (${completedRequired}/${requiredSteps.length}).`}
              </div>

              <p className="mt-3 text-center text-[11px] text-ink-faint">
                Preview only — online ordering coming soon.
              </p>
            </div>
          </aside>
        </div>
      </Container>
    </Section>
  );
}
