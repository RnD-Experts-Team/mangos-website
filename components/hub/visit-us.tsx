import type { Bar, Grill, Hours } from "@/types/content";
import { Reveal } from "@/components/ui/reveal";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function todayHours(hours: Hours[]) {
  return hours.find((h) => h.day === DAY_NAMES[new Date().getDay()]);
}

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
  const today = todayHours(hours);
  return (
    <div className="rounded-xl border border-white/10 bg-surface-1 p-5 sm:p-6">
      <p className="text-eyebrow text-[10px] text-ink-faint">{label}</p>
      <h3 className="mt-1.5 font-heading text-lg text-ink">{name}</h3>
      <p className="mt-2 text-sm text-ink-muted">
        {line1}, {city}
      </p>
      <p className="mt-3 text-sm">
        <span className="text-ink-faint">Today </span>
        <span className="font-medium text-accent">
          {today?.closed ? "Closed" : today ? `${today.open} – ${today.close}` : "—"}
        </span>
      </p>
      <a
        href={telHref(phone)}
        className="mt-3 inline-block text-sm text-ink-muted underline-offset-4 hover:text-ink hover:underline"
      >
        {phone}
      </a>
    </div>
  );
}

/** Hub-level teaser: quick address/hours/phone for both spots. Full detail lives on /bar and /grill. */
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
