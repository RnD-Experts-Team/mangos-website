import { getBrand } from "@/services/brand.service";
import { getBar } from "@/services/bar.service";
import { getGrill } from "@/services/grill.service";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { BrandHero } from "@/components/hub/brand-hero";
import { StoreCard } from "@/components/hub/store-card";
import { WalkConnector } from "@/components/hub/walk-connector";
import { SideGlow } from "@/components/hub/side-glow";
import { VisitUs } from "@/components/hub/visit-us";
import { CustomCursor } from "@/components/hub/custom-cursor";

export default async function HubPage() {
  const [brand, bar, grill] = await Promise.all([getBrand(), getBar(), getGrill()]);

  return (
    <section className="relative flex min-h-svh flex-col justify-center overflow-hidden pt-24 pb-16 sm:pt-28 lg:min-h-0 lg:justify-start lg:pt-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--vignette)" }}
      />
      <SideGlow />
      <CustomCursor />
      <Container className="relative">
        <div className="pt-6 sm:pt-8">
          <BrandHero brand={brand} />
        </div>

        <div className="mt-10 grid gap-3 sm:gap-4 lg:mt-14 lg:grid-cols-2">
          {brand.businesses.map((card, i) => (
            <Reveal key={card.id} delay={0.15 + i * 0.1}>
              <StoreCard card={card} />
            </Reveal>
          ))}
        </div>

        <WalkConnector note={brand.walkNote} />

        <VisitUs bar={bar} grill={grill} />
      </Container>
    </section>
  );
}
