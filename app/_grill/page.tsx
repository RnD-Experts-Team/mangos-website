import { getGrill } from "@/services/grill.service";
import { BusinessHero } from "@/components/business/business-hero";
import { HeroMeta } from "@/components/business/hero-meta";
import { AboutSection } from "@/components/grill/about-section";
import { MenuSection } from "@/components/grill/menu-section";
import { BowlBuilderSection } from "@/components/grill/bowl-builder";
import { MomentsStrip } from "@/components/grill/moments-strip";
import { PromotionsSection } from "@/components/bar/promotions-section";
import { ReviewsSection } from "@/components/bar/reviews-section";
import { GrillFooter } from "@/components/grill/grill-chrome";
import { CustomCursor } from "@/components/hub/custom-cursor";

export default async function GrillPage() {
  const grill = await getGrill();

  return (
    <>
      <CustomCursor />

      {/* Rendered in English now; Arabic (EN/ع + RTL) arrives in the next pass. */}
      <BusinessHero image={grill.heroImage} eyebrow={grill.kind.en} title={grill.name.en} objectFit="contain">
        <HeroMeta tagline={grill.tagline.en} address={grill.address} contact={grill.contact} hours={grill.hours} />
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
      />

      <MenuSection categories={grill.menu} />

      <BowlBuilderSection bowl={grill.bowl} />

      <MomentsStrip moments={grill.moments} />

      <PromotionsSection promotions={grill.promotions} />

      <ReviewsSection reviews={grill.reviews} />

      <GrillFooter grill={grill} />
    </>
  );
}
