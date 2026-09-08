import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

const MENU_PDF_URL = "/menu/Mangos_Menu_Complete.pdf";
/**
 * `#view=FitH` is a standard PDF "open parameter" (Adobe spec, honored by
 * Chrome/Edge's PDFium and Firefox's pdf.js) that sets the default zoom to
 * fit the page width — only applied to the inline embed below, not the
 * "open in a new tab" links, where the browser's own viewer should start
 * at its normal default. Tune the zoom by changing this fragment, e.g.
 * `#zoom=125` for a fixed 125% instead of fit-to-width.
 */
const MENU_PDF_EMBED_URL = `${MENU_PDF_URL}#view=FitH`;

/**
 * Temporary stand-in for the interactive menu (`menu-section.tsx`) — embeds
 * the current real menu as a scrollable PDF via the browser's native viewer
 * until a real digital menu replaces it. See `menu-section.tsx` for the
 * component this is standing in for; that file and `bar.menu` in
 * `data/bar.json` are untouched and ready to restore.
 */
export function MenuPdfSection() {
  return (
    <Section id="menu" className="scroll-mt-28 pt-0 sm:pt-0">
      <Container>
        <p className="text-eyebrow text-xs text-ink-faint">What&apos;s Pouring</p>
        <h2 className="mt-2 font-display text-4xl text-ink sm:text-5xl">The Menu</h2>

        <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-surface-1">
          <object
            data={MENU_PDF_EMBED_URL}
            type="application/pdf"
            className="h-[75vh] min-h-[500px] max-h-[900px] w-full"
          >
            {/* Fallback for browsers/devices that can't render the embed inline. */}
            <div className="flex h-[50vh] flex-col items-center justify-center gap-4 p-8 text-center">
              <p className="text-sm text-ink-muted">Your browser can&apos;t preview the menu inline.</p>
              <Button href={MENU_PDF_URL} target="_blank" rel="noopener noreferrer">
                Open the Menu
              </Button>
            </div>
          </object>
        </div>

        <Button
          variant="outline"
          href={MENU_PDF_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4"
        >
          Open menu in a new tab ↗
        </Button>
      </Container>
    </Section>
  );
}
