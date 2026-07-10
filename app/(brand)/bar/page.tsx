import type { Metadata } from "next";
import Link from "next/link";
import { getBar } from "@/services/bar.service";
import { BusinessHero } from "@/components/business/business-hero";
import { InfoBlock } from "@/components/business/info-block";
import { AboutSection } from "@/components/bar/about-section";
import { MenuSection } from "@/components/bar/menu-section";
import { MomentsGallery } from "@/components/bar/moments-gallery";
import { Container } from "@/components/ui/container";

export async function generateMetadata(): Promise<Metadata> {
  const bar = await getBar();
  return { title: bar.name, description: bar.blurb };
}

export default async function BarPage() {
  const bar = await getBar();

  return (
    <>
      <BusinessHero image={bar.heroImage} eyebrow={bar.kind} title={bar.name}>
        <p className="max-w-md text-base text-ink-muted">{bar.tagline}</p>
      </BusinessHero>

      <AboutSection about={bar.about} />

      <MenuSection categories={bar.menu} />

      <MomentsGallery moments={bar.moments} />

      <InfoBlock
        blurb={bar.blurb}
        address={bar.address}
        contact={bar.contact}
        hours={bar.hours}
      />

      <Container className="pb-20">
        <Link
          href="/"
          className="text-eyebrow text-xs text-ink-faint transition-colors hover:text-ink"
        >
          ← Back to Mangos
        </Link>
      </Container>
    </>
  );
}
