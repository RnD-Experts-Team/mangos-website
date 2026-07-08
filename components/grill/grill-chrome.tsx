import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";
import { Container } from "@/components/ui/container";
import type { Grill } from "@/types/content";

/**
 * Isolated Grill chrome. Deliberately self-contained: the only navigation is
 * back to `/grill`. No links to `/bar` or the hub live anywhere in this subtree.
 */
export function GrillHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-cinematic/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/grill"
          aria-label="Mangos Mediterranean Grill — home"
          className="flex items-baseline gap-2.5"
        >
          <Wordmark className="text-2xl" />
          <span className="hidden text-eyebrow text-[10px] text-ink-faint sm:block">
            Mediterranean Grill
          </span>
        </Link>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-gold">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          Halal Certified
        </span>
      </Container>
    </header>
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
