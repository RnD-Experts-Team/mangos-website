import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export function Section({
  className,
  children,
  id,
}: {
  className?: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className={cn("pt-16 pb-16 sm:pt-24 sm:pb-24", className)}>
      {children}
    </section>
  );
}
