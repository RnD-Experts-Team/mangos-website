"use client";

import { useCallback, useState } from "react";
import type { Lang } from "@/types/content";

/**
 * Minimal language state for the EN/ع toggle. In the later Grill pass this
 * grows into a provider that syncs `?lang`, sets `dir="rtl"` and swaps fonts.
 */
export function useLanguage(initial: Lang = "en") {
  const [lang, setLang] = useState<Lang>(initial);
  const toggle = useCallback(() => setLang((l) => (l === "en" ? "ar" : "en")), []);
  return { lang, setLang, toggle, dir: lang === "ar" ? "rtl" : "ltr" } as const;
}
