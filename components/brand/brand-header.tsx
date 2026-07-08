"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Wordmark } from "./wordmark";
import { useScrollCondense } from "@/hooks/use-scroll-condense";
import { dur, easeStandard } from "@/lib/motion";
import { cn } from "@/lib/cn";

export function BrandHeader() {
  const condensed = useScrollCondense(56);

  return (
    <motion.header
      className={cn("fixed inset-x-0 top-0 z-50 border-b", condensed && "backdrop-blur-md")}
      animate={{
        backgroundColor: condensed ? "rgba(10,10,11,0.72)" : "rgba(10,10,11,0)",
        borderBottomColor: condensed ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0)",
      }}
      transition={{ duration: dur.base, ease: easeStandard }}
    >
      <motion.div
        className="mx-auto flex max-w-6xl items-center justify-between px-5 sm:px-8"
        animate={{ height: condensed ? 62 : 82 }}
        transition={{ duration: dur.base, ease: easeStandard }}
      >
        <Link href="/" aria-label="Mangos — home" className="flex items-center">
          <motion.span
            className="origin-left"
            animate={{ scale: condensed ? 0.86 : 1 }}
            transition={{ duration: dur.base, ease: easeStandard }}
          >
            <Wordmark className="text-3xl" />
          </motion.span>
        </Link>
        <span className="hidden text-eyebrow text-[11px] text-ink-faint sm:block">
          Columbus, Ohio
        </span>
      </motion.div>
    </motion.header>
  );
}
