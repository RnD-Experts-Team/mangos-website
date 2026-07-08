import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";

/** Grill-scoped 404 — keeps the isolated experience intact on bad URLs. */
export default function GrillNotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-5 px-6 text-center">
      <Wordmark className="text-4xl" />
      <p className="text-ink-muted">This page isn’t on the menu.</p>
      <Link href="/grill" className="text-eyebrow text-xs text-accent">
        ← Back to the Grill
      </Link>
    </main>
  );
}
