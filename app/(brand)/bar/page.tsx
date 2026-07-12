import type { Metadata } from "next";
import Link from "next/link";
import { getBar } from "@/services/bar.service";
import { BusinessHero } from "@/components/business/business-hero";
import { HeroMeta } from "@/components/business/hero-meta";
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
        <HeroMeta tagline={bar.tagline} address={bar.address} hours={bar.hours} />
      </BusinessHero>

      <AboutSection
        about={bar.about}
        image={bar.aboutImage}
        address={bar.address}
        contact={bar.contact}
        hours={bar.hours}
      />

      <MenuSection categories={bar.menu} />

      <MomentsGallery moments={bar.moments} />

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
