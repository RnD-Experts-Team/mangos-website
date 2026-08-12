import { getBrand } from "@/services/brand.service";
import { getBar } from "@/services/bar.service";
import { getGrill } from "@/services/grill.service";
import { Container } from "@/components/ui/container";
import { BusinessCards } from "@/components/hub/business-cards";
import { WalkConnector } from "@/components/hub/walk-connector";
// import { SideGlow } from "@/components/hub/side-glow";
import { VisitUs } from "@/components/hub/visit-us";
import { CustomCursor } from "@/components/hub/custom-cursor";
import { IntroScreen } from "@/components/hub/intro-screen";
import { IntroProvider } from "@/components/hub/intro-context";

export default async function HubPage() {
  const [brand, bar, grill] = await Promise.all([getBrand(), getBar(), getGrill()]);

  const entries = brand.businesses.map((card) => {
    const info = card.id === "bar" ? bar : grill;
    return { card, address: info.address, phone: info.contact.phone, email: info.contact.email };
  });

  return (
    <IntroProvider>
      <IntroScreen tagline={brand.tagline} />

      <section className="relative flex min-h-svh flex-col justify-center overflow-hidden bg-cinematic pt-20 pb-16 sm:pt-24 lg:min-h-0 lg:justify-start lg:pt-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: "var(--vignette)" }}
        />
        {/* <SideGlow /> */}
        <CustomCursor />
        <Container className="relative max-w-7xl">
          <BusinessCards entries={entries} />

          <WalkConnector note={brand.walkNote} />

          <VisitUs bar={bar} grill={grill} />
        </Container>
      </section>
    </IntroProvider>
  );
}
