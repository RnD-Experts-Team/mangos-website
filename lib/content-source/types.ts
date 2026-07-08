import type { Brand, Bar, Grill } from "@/types/content";

/**
 * The single seam between the app and its content. Today it's backed by
 * local JSON (`mock-source`); later by the real backend (`http-source`).
 * Swapping implementations changes no caller.
 */
export interface ContentSource {
  getBrand(): Promise<Brand>;
  getBar(): Promise<Bar>;
  getGrill(): Promise<Grill>;
}
