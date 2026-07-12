import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type { Address, Contact, Hours, ImageAsset } from "@/types/content";

const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function PinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden className="text-ink-faint">
      <path d="M12 21s6.5-6 6.5-11A6.5 6.5 0 0 0 5.5 10c0 5 6.5 11 6.5 11Z" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="9.5" r="2.2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function AboutSection({
  name,
  about,
  image,
  address,
  contact,
  hours,
  halalCertified,
  chef,
  mockContact,
}: {
  name: string;
  about: string;
  image: ImageAsset;
  address: Address;
  contact: Contact;
  hours: Hours[];
  halalCertified: boolean;
  chef: { name: string; note: string };
  mockContact?: boolean;
}) {
  const todayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const byDay: Record<string, Hours> = {};
  for (const h of hours) byDay[h.day] = h;
  const ordered = DAY_ORDER.map((d) => byDay[d]).filter(Boolean);

  return (
    <Section>
      <Container className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <Reveal>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-heading text-xs uppercase tracking-[0.16em] text-ink-faint">
              About {name}
            </h2>
            {halalCertified && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-gold">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                Halal Certified
              </span>
            )}
          </div>
          <p className="mt-4 max-w-prose text-lg leading-relaxed text-ink-muted">{about}</p>

          <div className="mt-6 border-l-2 border-gold/40 pl-4">
            <p className="font-heading text-sm uppercase tracking-[0.12em] text-ink">{chef.name}</p>
            <p className="mt-1 max-w-prose text-sm italic text-ink-muted">“{chef.note}”</p>
          </div>

          <a
            href={address.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-ink"
          >
            <PinIcon />
            {address.line1}, {address.city}, {address.state} {address.zip}
          </a>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button href={telHref(contact.phone)}>Call {contact.phone}</Button>
            <Button variant="outline" href={`mailto:${contact.email}`}>
              Email
            </Button>
            {address.mapUrl && (
              <Button variant="outline" href={address.mapUrl} target="_blank" rel="noopener noreferrer">
                Directions
              </Button>
            )}
          </div>
          {mockContact && (
            <p className="mt-3 text-xs text-ink-faint">
              Phone &amp; email are placeholders — real details coming soon.
            </p>
          )}

          <div className="mt-8 rounded-2xl border border-white/10 bg-surface-1 p-5 sm:p-6">
            <h3 className="font-heading text-xs uppercase tracking-[0.16em] text-ink-faint">Hours</h3>
            <ul className="mt-3 grid grid-cols-1 gap-x-8 gap-y-1.5 text-sm sm:grid-cols-2">
              {ordered.map((h) => {
                const today = h.day === todayName;
                return (
                  <li
                    key={h.day}
                    className={cn("flex justify-between gap-4", today ? "text-ink" : "text-ink-muted")}
                  >
                    <span className={today ? "font-medium" : undefined}>{h.day}</span>
                    <span className="tabular-nums">
                      {h.closed ? "Closed" : `${h.open} – ${h.close}`}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="flex justify-center lg:justify-end">
          <div className="relative w-full max-w-sm">
            <div aria-hidden className="absolute -inset-6 rounded-[2rem] bg-gold/15 blur-3xl" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 shadow-[var(--shadow-2)]">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 1024px) 90vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0" style={{ background: "var(--vignette)" }} />
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
