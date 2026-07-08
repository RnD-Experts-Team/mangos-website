import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import type { Address, Contact, Hours } from "@/types/content";

function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function InfoBlock({
  blurb,
  address,
  contact,
  hours,
  note,
}: {
  blurb: string;
  address: Address;
  contact: Contact;
  hours: Hours[];
  note?: string;
}) {
  return (
    <Section>
      <Container className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <div>
          <p className="max-w-prose text-lg leading-relaxed text-ink-muted">{blurb}</p>
          <div className="mt-8 flex flex-wrap gap-3">
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
          {note && <p className="mt-6 max-w-prose text-xs leading-relaxed text-ink-faint">{note}</p>}
        </div>

        <div className="rounded-2xl border border-white/10 bg-surface-1 p-6 sm:p-8">
          <h3 className="font-heading text-xs uppercase tracking-[0.16em] text-ink-faint">Find us</h3>
          <address className="mt-3 not-italic leading-relaxed text-ink">
            {address.line1}
            <br />
            {address.city}, {address.state} {address.zip}
          </address>

          <h3 className="mt-7 font-heading text-xs uppercase tracking-[0.16em] text-ink-faint">Hours</h3>
          <ul className="mt-3 space-y-1.5 text-sm">
            {hours.map((h) => (
              <li key={h.day} className="flex justify-between gap-6 text-ink-muted">
                <span>{h.day}</span>
                <span className="tabular-nums">
                  {h.closed ? "Closed" : `${h.open} – ${h.close}`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
