import { getGrill } from "@/services/grill.service";
import { BusinessHero } from "@/components/business/business-hero";
import { HeroMeta } from "@/components/business/hero-meta";
import { AboutSection } from "@/components/grill/about-section";
import { MenuSection } from "@/components/grill/menu-section";
import { BowlBuilderSection } from "@/components/grill/bowl-builder";
import { MomentsStrip } from "@/components/grill/moments-strip";
import { GrillFooter } from "@/components/grill/grill-chrome";

export default async function GrillPage() {
  const grill = await getGrill();

  return (
    <>
      {/* Rendered in English now; Arabic (EN/ع + RTL) arrives in the next pass. */}
      <BusinessHero image={grill.heroImage} eyebrow={grill.kind.en} title={grill.name.en} objectFit="contain">
        <HeroMeta tagline={grill.tagline.en} address={grill.address} hours={grill.hours} />
      </BusinessHero>

      <AboutSection
        name={grill.name.en}
        about={grill.about.en}
        image={grill.aboutImage}
        address={grill.address}
        contact={grill.contact}
        hours={grill.hours}
        halalCertified={grill.halalCertified}
        chef={{ name: grill.chef.name, note: grill.chef.note.en }}
        mockContact={grill.mockContact}
      />

      <MenuSection categories={grill.menu} />

      <BowlBuilderSection bowl={grill.bowl} />

      <MomentsStrip moments={grill.moments} />

      <GrillFooter grill={grill} />
    </>
  );
}
