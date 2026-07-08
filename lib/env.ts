import { z } from "zod";

/**
 * Validated environment. Today defaults to the local mock JSON source;
 * flip CONTENT_SOURCE=http + API_BASE_URL to point at the real backend.
 */
const schema = z.object({
  CONTENT_SOURCE: z.enum(["mock", "http"]).default("mock"),
  API_BASE_URL: z.string().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().optional(),
});

export const env = schema.parse({
  CONTENT_SOURCE: process.env.CONTENT_SOURCE,
  API_BASE_URL: process.env.API_BASE_URL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});
