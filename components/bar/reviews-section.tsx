import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type { ReviewsBlock } from "@/types/content";

/**
 * Five stars, filled up to `rating`. Crimson rather than gold — `--color-gold`
 * is reserved for the Halal seal, and crimson matches the menu's price text.
 */
function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <span
      className={cn("inline-flex items-center gap-0.5", className)}
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          aria-hidden
          className={i <= rating ? "text-accent" : "text-white/15"}
        >
          <path
            fill="currentColor"
            d="M12 2.6l2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 17.4l-5.8 3.06 1.1-6.46-4.69-4.58 6.49-.94L12 2.6Z"
          />
        </svg>
      ))}
    </span>
  );
}

export function ReviewsSection({ reviews }: { reviews: ReviewsBlock }) {
  return (
    <Section id="reviews" className="scroll-mt-28">
      <Container>
        <Reveal>
          <p className="text-eyebrow text-xs text-ink-faint">{reviews.eyebrow}</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
            <h2 className="font-display text-4xl text-ink sm:text-5xl">{reviews.title}</h2>
            {reviews.averageRating && (
              <div className="flex items-center gap-2.5">
                <Stars rating={Math.round(reviews.averageRating)} />
                <span className="font-heading text-sm tabular-nums text-ink">
                  {reviews.averageRating.toFixed(1)}
                </span>
                {reviews.totalCount && (
                  <span className="text-sm text-ink-faint">
                    · {reviews.totalCount} reviews
                  </span>
                )}
              </div>
            )}
          </div>
          <p className="mt-4 max-w-prose text-base leading-relaxed text-ink-muted">
            {reviews.intro}
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.items.map((review, i) => (
            <Reveal key={review.id} delay={0.06 * i}>
              <figure className="flex h-full flex-col rounded-2xl border border-white/10 bg-surface-1 p-5 sm:p-6">
                <Stars rating={review.rating} />
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink-muted">
                  {review.text}
                </blockquote>
                <figcaption className="mt-5 flex items-center justify-between gap-3">
                  <span className="min-w-0">
                    <span className="block truncate font-heading text-sm text-ink">
                      {review.author}
                    </span>
                    {review.date && (
                      <span className="block text-xs text-ink-faint">{review.date}</span>
                    )}
                  </span>
                  <span className="shrink-0 rounded-full border border-white/10 bg-surface-2 px-2.5 py-0.5 text-xs text-ink-muted">
                    {review.source}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        {reviews.googleReviewUrl && (
          <Reveal delay={0.1} className="mt-8">
            <Button
              variant="outline"
              href={reviews.googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Review us on Google
            </Button>
          </Reveal>
        )}
      </Container>
    </Section>
  );
}
