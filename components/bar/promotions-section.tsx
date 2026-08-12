"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type { Promotion, PromotionsBlock } from "@/types/content";

/**
 * `components/ui/button.tsx` renders an <a>, so it can't be a submit control.
 * These are its base + solid-variant classes, reused on real <button>s here.
 */
const BTN_BASE =
  "inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 " +
  "font-heading text-sm font-medium uppercase tracking-[0.08em] " +
  "transition-[background-color,border-color,box-shadow,color,transform] duration-200 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.98]";
const BTN_SOLID =
  "bg-accent text-white hover:bg-accent-hover shadow-[var(--glow-accent)] " +
  "hover:shadow-[0_0_34px_rgba(196,33,47,0.5)]";

/** A revealed discount code with copy-to-clipboard. */
function CodeChip({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      return; // Clipboard blocked (insecure context / denied) — leave the code visible to read.
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={copy}
      title={copied ? "Copied" : "Click to copy"}
      className={cn(
        "inline-flex cursor-pointer items-center rounded-full border px-3.5 py-1.5 transition-colors",
        copied ? "border-accent bg-accent/20" : "border-dashed border-accent/50 bg-accent/10 hover:border-accent",
      )}
    >
      <span className="font-heading text-sm tracking-[0.14em] text-ink">{code}</span>
    </button>
  );
}

/**
 * Mock signup: validates via the native `type="email"` constraint, then reveals
 * the code. No network call — there is no submission backend yet.
 */
function NewsletterForm({ promo }: { promo: Promotion }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO(backend): POST { email } to the real newsletter provider here.
    // Everything else on this card already reads from data/bar.json.
    setDone(true);
  }

  if (done) {
    return (
      <div className="mt-5">
        <p className="text-sm text-ink">
          You&apos;re on the list — here&apos;s your code:
        </p>
        {promo.code && (
          <div className="mt-3">
            <CodeChip code={promo.code} />
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-2.5 sm:flex-row">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
        className="h-11 min-w-0 flex-1 rounded-full border border-white/15 bg-surface-2 px-4 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
      />
      <button type="submit" className={cn(BTN_BASE, BTN_SOLID, "shrink-0 cursor-pointer")}>
        Get the code
      </button>
    </form>
  );
}

export function PromotionsSection({ promotions }: { promotions: PromotionsBlock }) {
  return (
    <Section id="offers" className="scroll-mt-28 border-y border-white/10 bg-surface-1/40">
      <Container>
        <Reveal>
          <p className="text-eyebrow text-xs text-ink-faint">{promotions.eyebrow}</p>
          <h2 className="mt-2 font-display text-4xl text-ink sm:text-5xl">{promotions.title}</h2>
          <p className="mt-4 max-w-prose text-base leading-relaxed text-ink-muted">
            {promotions.intro}
          </p>
        </Reveal>

        {/* Three cards fan out to 3 columns; a shorter set stays at 2 so it never leaves a hole. */}
        <div
          className={cn(
            "mt-10 grid gap-4",
            promotions.items.length >= 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2",
          )}
        >
          {promotions.items.map((promo, i) => (
            <Reveal key={promo.id} delay={0.08 * i}>
              <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-surface-1 p-6 sm:p-7">
                <p className="text-eyebrow text-[11px] text-ink-faint">{promo.eyebrow}</p>
                {promo.highlight && (
                  <p className="mt-3 font-display text-4xl leading-none text-accent">
                    {promo.highlight}
                  </p>
                )}
                <h3 className="mt-3 font-heading text-lg text-ink">{promo.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{promo.description}</p>

                <div className="mt-auto">
                  {promo.kind === "newsletter" ? (
                    <NewsletterForm promo={promo} />
                  ) : (
                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      {promo.href && (
                        <Button
                          href={promo.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          variant={promo.kind === "giftcard" ? "solid" : "outline"}
                        >
                          {promo.ctaLabel ?? "Learn more"}
                        </Button>
                      )}
                    </div>
                  )}

                  {promo.terms && (
                    <p className="mt-4 text-xs leading-relaxed text-ink-faint">{promo.terms}</p>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
