import type { Metadata } from "next";
import { GrillHeader } from "@/components/grill/grill-chrome";

export const metadata: Metadata = {
  title: "Mangos Mediterranean Grill",
  description: "Halal Syrian-Lebanese kitchen in Columbus, Ohio — shawarma, kebab, falafel and bowls.",
  alternates: { canonical: "/grill" },
};

/**
 * Isolated Grill layout — intentionally outside the (brand) group so it never
 * inherits brand navigation. Nothing here links to /bar or the hub. This is
 * also where the LanguageProvider (EN/ع + RTL) mounts in the later pass.
 */
export default function GrillLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GrillHeader />
      <main>{children}</main>
    </>
  );
}
