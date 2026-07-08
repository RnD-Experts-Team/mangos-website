import { cn } from "@/lib/cn";

/**
 * The MANGOS wordmark in Bebas Neue. `outline` layers a crimson stroke behind
 * a white fill to echo the logo (used big, in heroes).
 */
export function Wordmark({
  className,
  outline = false,
}: {
  className?: string;
  outline?: boolean;
}) {
  if (outline) {
    return (
      <span className={cn("relative inline-block font-display leading-none", className)}>
        <span
          aria-hidden
          className="absolute inset-0 select-none"
          style={{ WebkitTextStroke: "0.08em var(--color-accent)", color: "transparent" }}
        >
          MANGOS
        </span>
        <span className="relative text-white">MANGOS</span>
      </span>
    );
  }
  return <span className={cn("font-display leading-none text-white", className)}>MANGOS</span>;
}
