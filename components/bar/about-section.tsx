import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

export function AboutSection({ about }: { about: string }) {
  return (
    <Section>
      <Container>
        <Reveal>
          <h2 className="font-heading text-xs uppercase tracking-[0.16em] text-ink-faint">
            About Mangos Cafe
          </h2>
          <p className="mt-4 max-w-prose text-lg leading-relaxed text-ink-muted">{about}</p>
        </Reveal>
      </Container>
    </Section>
  );
}
