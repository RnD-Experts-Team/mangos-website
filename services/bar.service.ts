import "server-only";
import { getContentSource } from "@/lib/content-source";

/** Bar (Mangos Cafe) content. */
export const getBar = () => getContentSource().getBar();
