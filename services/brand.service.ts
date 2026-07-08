import "server-only";
import { getContentSource } from "@/lib/content-source";

/** Hub/brand content. Call directly from Server Components. */
export const getBrand = () => getContentSource().getBrand();
