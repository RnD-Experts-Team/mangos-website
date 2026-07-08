import brandJson from "@/data/brand.json";
import barJson from "@/data/bar.json";
import grillJson from "@/data/grill.json";
import type { Brand, Bar, Grill } from "@/types/content";
import type { ContentSource } from "./types";

/** Reads the mock JSON in /data. The current default source. */
export const mockSource: ContentSource = {
  getBrand: async () => brandJson as unknown as Brand,
  getBar: async () => barJson as unknown as Bar,
  getGrill: async () => grillJson as unknown as Grill,
};
