import { Bebas_Neue, Oswald, IBM_Plex_Sans, IBM_Plex_Sans_Arabic } from "next/font/google";

/** Display wordmark / huge titles — Latin only (all-caps). */
export const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
  display: "swap",
});

/** Headings, eyebrows, nav, buttons — Latin only. */
export const oswald = Oswald({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-oswald",
  display: "swap",
});

/** Body / small UI. */
export const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex",
  display: "swap",
});

/** Arabic (loaded + ready for the later Grill Arabic/RTL pass). */
export const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-arabic",
  display: "swap",
});

/** All font CSS variables, applied on <html>. */
export const fontVariables = `${bebas.variable} ${oswald.variable} ${plex.variable} ${plexArabic.variable}`;
