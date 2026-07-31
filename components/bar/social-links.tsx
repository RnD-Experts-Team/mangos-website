import type { SocialLink } from "@/types/content";
import { cn } from "@/lib/cn";

/** Monochrome brand glyphs, keyed by the lowercased `label` in the content. */
const ICONS: Record<string, React.ReactNode> = {
  instagram: (
    <>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17.6" cy="6.4" r="1.2" fill="currentColor" />
    </>
  ),
  tiktok: (
    <path
      fill="currentColor"
      d="M16.5 2.5c.45 2.2 1.85 3.75 3.9 4.05v3.2a7.6 7.6 0 0 1-3.9-1.25v6.4a6 6 0 1 1-6-6c.3 0 .6.02.9.07v3.35a2.75 2.75 0 1 0 1.9 2.6V2.5h3.2Z"
    />
  ),
  facebook: (
    <path
      fill="currentColor"
      d="M13.6 21.5v-8h2.7l.5-3.2h-3.2V8.2c0-.9.3-1.6 1.6-1.6h1.7V3.7c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.2v3.2H10v8h3.6Z"
    />
  ),
  google: (
    <path
      fill="currentColor"
      d="M12 10.9v2.9h4.7c-.2 1.2-1.5 3.5-4.7 3.5a5.3 5.3 0 1 1 0-10.6c1.5 0 2.5.65 3.1 1.2l2.1-2.05A8.4 8.4 0 0 0 12 3.5a8.5 8.5 0 1 0 0 17c4.9 0 8.1-3.45 8.1-8.3 0-.55-.05-.95-.15-1.3H12Z"
    />
  ),
};

function FallbackIcon() {
  return (
    <path
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      fill="none"
      d="M10.5 13.5a3.5 3.5 0 0 0 5 0l3-3a3.54 3.54 0 0 0-5-5l-1 1m-2 6a3.5 3.5 0 0 1 0-5l1-1m-4 4-3 3a3.54 3.54 0 0 0 5 5l1-1"
    />
  );
}

/** Row of social icon links. Renders nothing when the business has no socials. */
export function SocialLinks({
  socials,
  className,
}: {
  socials?: SocialLink[];
  className?: string;
}) {
  if (!socials || socials.length === 0) return null;

  const base =
    "flex h-9 w-9 items-center justify-center rounded-full border border-white/15 transition-colors";

  return (
    <ul className={cn("flex flex-wrap items-center gap-2", className)}>
      {socials.map((s) => {
        const icon = (
          <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden>
            {ICONS[s.label.toLowerCase()] ?? <FallbackIcon />}
          </svg>
        );

        // No real URL yet — show the icon but don't make it a link that goes nowhere.
        if (!s.href || s.href === "#") {
          return (
            <li key={s.label}>
              <span
                aria-label={`${s.label} — coming soon`}
                title={`${s.label} — coming soon`}
                className={cn(base, "cursor-default text-ink-faint/50")}
              >
                {icon}
              </span>
            </li>
          );
        }

        return (
          <li key={s.label}>
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              title={s.label}
              className={cn(
                base,
                "text-ink-muted hover:border-accent hover:bg-accent/10 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2",
              )}
            >
              {icon}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
