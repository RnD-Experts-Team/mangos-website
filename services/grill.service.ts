import "server-only";
import { getContentSource } from "@/lib/content-source";

/** Grill (Mangos Mediterranean Grill) content. */
export const getGrill = () => getContentSource().getGrill();
