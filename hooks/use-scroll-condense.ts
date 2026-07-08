"use client";

import { useEffect, useState } from "react";

/** True once the page is scrolled past `threshold` px — for condensing headers. */
export function useScrollCondense(threshold = 48) {
  const [condensed, setCondensed] = useState(false);

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return condensed;
}
