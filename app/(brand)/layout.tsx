import { BrandHeader } from "@/components/brand/brand-header";
import { BrandFooter } from "@/components/brand/brand-footer";

/** Shared brand chrome for the hub (`/`) and the bar (`/bar`). */
export default function BrandLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BrandHeader />
      <main>{children}</main>
      <BrandFooter />
    </>
  );
}
