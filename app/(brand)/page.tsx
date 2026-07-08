import { getBrand } from "@/services/brand.service";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { BrandHero } from "@/components/hub/brand-hero";
import { StoreCard } from "@/components/hub/store-card";
import { WalkConnector } from "@/components/hub/walk-connector";

export default async function HubPage() {
  const brand = await getBrand();

  return (
    <section className="relative flex min-h-svh flex-col justify-center overflow-hidden pt-28 pb-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--vignette)" }}
      />
      <Container className="relative">
        <div className="pt-6 sm:pt-8">
          <BrandHero brand={brand} />
        </div>

        <div className="mt-12 grid gap-3 sm:gap-4 lg:mt-16 lg:grid-cols-2">
          {brand.businesses.map((card, i) => (
            <Reveal key={card.id} delay={0.15 + i * 0.1}>
              <StoreCard card={card} />
            </Reveal>
          ))}
        </div>

        <WalkConnector note={brand.walkNote} />
      </Container>
    </section>
  );
}
