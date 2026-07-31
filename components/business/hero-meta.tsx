"use client";

import { useSyncExternalStore } from "react";
import { useMapsHref } from "@/hooks/use-maps-href";
import type { Address, Hours } from "@/types/content";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function toMin(t: string) {
  const m = /(\d+):(\d+)\s*(AM|PM)/i.exec(t);
  if (!m) return 0;
  let h = Number(m[1]) % 12;
  if (/pm/i.test(m[3])) h += 12;
  return h * 60 + Number(m[2]);
}

/**
 * Returns "open|until 1:00 AM" or "closed|opens Thu 4:00 PM" (or "closed|").
 * A single string keeps `useSyncExternalStore` snapshots referentially stable
 * within a minute (avoids re-render loops). Handles past-midnight closings.
 */
function computeStatus(hours: Hours[]): string {
  const now = new Date();
  const dow = now.getDay();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const byName: Record<string, Hours> = {};
  for (const h of hours) byName[h.day] = h;

  // Still open from yesterday's late-night session that crossed midnight?
  const yest = byName[DAYS[(dow + 6) % 7]];
  if (yest && !yest.closed) {
    const yo = toMin(yest.open);
    const yc = toMin(yest.close);
    if (yc <= yo && nowMin < yc) return `open|until ${yest.close}`;
  }
  // Today's session.
  const today = byName[DAYS[dow]];
  if (today && !today.closed) {
    const o = toMin(today.open);
    const c = toMin(today.close);
    const crosses = c <= o;
    if (crosses ? nowMin >= o : nowMin >= o && nowMin < c) return `open|until ${today.close}`;
  }
  // Closed → find the next opening.
  for (let off = 0; off < 8; off++) {
    const day = (dow + off) % 7;
    const e = byName[DAYS[day]];
    if (!e || e.closed) continue;
    if (off === 0 && nowMin >= toMin(e.open)) continue;
    return `closed|opens ${off === 0 ? e.open : `${SHORT[day]} ${e.open}`}`;
  }
  return "closed|";
}

function subscribe(cb: () => void) {
  const id = setInterval(cb, 60_000);
  return () => clearInterval(id);
}

function PinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden className="text-ink-faint">
      <path d="M12 21s6.5-6 6.5-11A6.5 6.5 0 0 0 5.5 10c0 5 6.5 11 6.5 11Z" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="9.5" r="2.2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function HeroMeta({
  tagline,
  address,
  hours,
}: {
  tagline: string;
  address: Address;
  hours: Hours[];
}) {
  const status = useSyncExternalStore(subscribe, () => computeStatus(hours), () => "");
  const [state, detail] = status.split("|");
  const open = state === "open";
  const mapsHref = useMapsHref(address);

  return (
    <div className="max-w-md">
      <p className="text-base text-ink-muted">{tagline}</p>
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-ink-muted">
        <a
          href={mapsHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 transition-colors hover:text-ink"
        >
          <PinIcon />
          {address.line1} · {address.city}, {address.state}
        </a>

        {open && (
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-positive" />
            <span className="text-ink">Open now</span>
            {detail && <span className="text-ink-faint">· {detail}</span>}
          </span>
        )}
      </div>
    </div>
  );
}
