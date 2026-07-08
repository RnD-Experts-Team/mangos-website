import { env } from "@/lib/env";
import type { ContentSource } from "./types";
import { mockSource } from "./mock-source";
import { httpSource } from "./http-source";

/** Picks the content source from the environment (mock today, http later). */
export function getContentSource(): ContentSource {
  return env.CONTENT_SOURCE === "http" ? httpSource : mockSource;
}

export type { ContentSource };
