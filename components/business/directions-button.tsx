"use client";

import { Button } from "@/components/ui/button";
import { useMapsHref } from "@/hooks/use-maps-href";
import type { Address } from "@/types/content";

/**
 * Directions link that resolves to Apple Maps on Apple devices. Exists as its
 * own client component so server-rendered sections can use the hook.
 */
export function DirectionsButton({ address }: { address: Address }) {
  const href = useMapsHref(address);
  if (!href) return null;

  return (
    <Button variant="outline" href={href} target="_blank" rel="noopener noreferrer">
      Directions
    </Button>
  );
}
