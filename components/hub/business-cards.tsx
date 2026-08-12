"use client";

import { motion } from "motion/react";
import { staggerContainer, fadeUp } from "@/lib/motion";
import { useIntroDone } from "@/components/hub/intro-context";
import { StoreCard } from "@/components/hub/store-card";
import type { Address, BrandCard } from "@/types/content";

interface BusinessCardEntry {
  card: BrandCard;
  address: Address;
  phone: string;
  email: string;
}

/**
 * Card grid gated on the intro finishing rather than `whileInView` — the cards
 * sit above the fold, so a viewport-triggered reveal would resolve invisibly
 * behind the intro's opaque curtain and never actually be seen.
 */
export function BusinessCards({ entries }: { entries: BusinessCardEntry[] }) {
  const introDone = useIntroDone();

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate={introDone ? "show" : "hidden"}
      className="grid gap-3 sm:gap-4 lg:grid-cols-2"
    >
      {entries.map((entry) => (
        <motion.div key={entry.card.id} variants={fadeUp}>
          <StoreCard card={entry.card} address={entry.address} phone={entry.phone} email={entry.email} />
        </motion.div>
      ))}
    </motion.div>
  );
}
