"use client";

import { useEffect, useState } from "react";
import type { Address } from "@/types/content";

/**
 * Picks the right maps URL for the visitor's platform: Apple Maps on Apple
 * devices, the Google link everywhere else.
 *
 * The `useState(false)` + `useEffect` shape is load-bearing — server and first
 * client render both emit the Google URL, so there's no hydration mismatch;
 * the swap happens after mount. Reading `navigator` during render would break SSR.
 *
 * `Macintosh` catches iPads for free: iPadOS 13+ deliberately reports a desktop
 * Safari UA, so a naive /iPad/ test misses every modern iPad.
 */
export function useMapsHref(address: Address): string | undefined {
  const [apple, setApple] = useState(false);

  useEffect(() => {
    setApple(/iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent));
  }, []);

  return apple && address.appleMapUrl ? address.appleMapUrl : address.mapUrl;
}
