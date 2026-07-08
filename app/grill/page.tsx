import { getGrill } from "@/services/grill.service";
import { BusinessHero } from "@/components/business/business-hero";
import { InfoBlock } from "@/components/business/info-block";
import { GrillFooter } from "@/components/grill/grill-chrome";

export default async function GrillPage() {
  const grill = await getGrill();
  const note = grill.mockContact
    ? "Contact details shown are placeholders pending the final location info."
    : undefined;

  return (
    <>
      {/* Rendered in English now; Arabic (EN/ع + RTL) arrives in the next pass. */}
      <BusinessHero image={grill.heroImage} eyebrow={grill.kind.en} title={grill.name.en}>
        <p className="max-w-md text-base text-ink-muted">{grill.tagline.en}</p>
      </BusinessHero>

      <InfoBlock
        blurb={grill.blurb.en}
        address={grill.address}
        contact={grill.contact}
        hours={grill.hours}
        note={note}
      />

      <GrillFooter grill={grill} />
    </>
  );
}
