import { cn } from "@/lib/cn";
import type { ComponentProps } from "react";

const variants = {
  solid: "bg-accent text-white hover:bg-accent-hover shadow-[var(--glow-accent)] hover:shadow-[0_0_34px_rgba(196,33,47,0.5)]",
  outline: "border border-white/20 text-ink hover:border-white/40 hover:bg-white/[0.06]",
  ghost: "text-ink-muted hover:text-ink",
} as const;

type ButtonProps = ComponentProps<"a"> & { variant?: keyof typeof variants };

/** Link-styled action (tel:, mailto:, maps, internal). */
export function Button({ variant = "solid", className, ...props }: ButtonProps) {
  return (
    <a
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-full px-5",
        "font-heading text-sm font-medium uppercase tracking-[0.08em]",
        "transition-[background-color,border-color,box-shadow,color,transform] duration-200",
        "focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.98]",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
