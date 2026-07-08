import { getBrand } from "@/services/brand.service";
import { Wordmark } from "./wordmark";
import { Container } from "@/components/ui/container";

export async function BrandFooter() {
  const brand = await getBrand();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-cinematic">
      <Container className="flex flex-col items-center gap-5 py-12 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex flex-col items-center gap-1.5 sm:items-start">
          <Wordmark className="text-2xl" />
          <p className="text-xs text-ink-faint">
            {brand.tagline} · {brand.location}
          </p>
        </div>
        <p className="text-xs text-ink-faint">
          © {year} Mangos · Est. {brand.established}
        </p>
      </Container>
    </footer>
  );
}
