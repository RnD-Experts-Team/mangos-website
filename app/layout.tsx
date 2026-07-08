import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import { MotionProvider } from "@/components/providers/motion-provider";
import { TransitionProvider } from "@/components/providers/transition-provider";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Mangos — Columbus, Ohio",
    template: "%s · Mangos",
  },
  description:
    "Mangos — one brand, two experiences a one-minute walk apart in Columbus, Ohio. A bar and a halal Mediterranean grill.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fontVariables} h-full antialiased`}>
      <body className="min-h-full">
        <MotionProvider>
          <TransitionProvider>{children}</TransitionProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
