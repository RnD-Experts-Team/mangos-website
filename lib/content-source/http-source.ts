import "server-only";
import type { Brand, Bar, Grill } from "@/types/content";
import { env } from "@/lib/env";
import type { ContentSource } from "./types";

/** Fetches content from the real backend. Enabled via CONTENT_SOURCE=http. */
async function get<T>(path: string): Promise<T> {
  const base = env.API_BASE_URL;
  if (!base) {
    throw new Error("API_BASE_URL must be set when CONTENT_SOURCE=http");
  }
  const res = await fetch(`${base}${path}`, { next: { revalidate: 300 } });
  if (!res.ok) {
    throw new Error(`Content fetch failed: ${path} → ${res.status}`);
  }
  return (await res.json()) as T;
}

export const httpSource: ContentSource = {
  getBrand: () => get<Brand>("/brand"),
  getBar: () => get<Bar>("/bar"),
  getGrill: () => get<Grill>("/grill"),
};
