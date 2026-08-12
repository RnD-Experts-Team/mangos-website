import type { Bar, Grill, Hours } from "@/types/content";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/cn";

const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function VisitCard({
  label,
  name,
  line1,
  city,
  phone,
  hours,
}: {
  label: string;
  name: string;
  line1: string;
  city: string;
  phone: string;
  hours: Hours[];
}) {
  const todayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const byDay: Record<string, Hours> = {};
  for (const h of hours) byDay[h.day] = h;
  const ordered = DAY_ORDER.map((d) => byDay[d]).filter(Boolean);

  return (
    <div className="rounded-xl border border-white/10 bg-surface-1 p-5 sm:p-6">
      <p className="text-eyebrow text-[10px] text-ink-faint">{label}</p>
      <h3 className="mt-1.5 font-heading text-lg text-ink">{name}</h3>
      <p className="mt-2 text-sm text-ink-muted">
        {line1}, {city}
      </p>

      <h4 className="mt-4 font-heading text-[10px] uppercase tracking-[0.16em] text-ink-faint">
        Hours
      </h4>
      <ul className="mt-2 grid grid-cols-1 gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
        {ordered.map((h) => {
          const today = h.day === todayName;
          return (
            <li
              key={h.day}
              className={cn("flex items-center justify-between gap-4", today ? "text-ink" : "text-ink-muted")}
            >
              <span className={cn("inline-flex items-center gap-1.5", today && "font-medium")}>
                {today && <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />}
                {h.day}
              </span>
              <span className={cn("tabular-nums", today && "font-semibold text-accent")}>
                {h.closed ? "Closed" : `${h.open} – ${h.close}`}
              </span>
            </li>
          );
        })}
      </ul>

      <a
        href={telHref(phone)}
        className="mt-4 inline-block text-sm text-ink-muted underline-offset-4 hover:text-ink hover:underline"
      >
        {phone}
      </a>
    </div>
  );
}

/** Hub-level summary: address, full weekly hours, and phone for both spots. */
export function VisitUs({ bar, grill }: { bar: Bar; grill: Grill }) {
  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2 sm:gap-6">
      <Reveal delay={0.05}>
        <VisitCard
          label={bar.kind}
          name={bar.name}
          line1={bar.address.line1}
          city={bar.address.city}
          phone={bar.contact.phone}
          hours={bar.hours}
        />
      </Reveal>
      <Reveal delay={0.1}>
        <VisitCard
          label={grill.kind.en}
          name={grill.name.en}
          line1={grill.address.line1}
          city={grill.address.city}
          phone={grill.contact.phone}
          hours={grill.hours}
        />
      </Reveal>
    </div>
  );
}
