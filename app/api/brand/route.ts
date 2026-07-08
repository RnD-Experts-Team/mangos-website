import { NextResponse } from "next/server";
import { getBrand } from "@/services/brand.service";

/** GET /api/brand — the JSON contract client hooks & the future CMS consume. */
export async function GET() {
  return NextResponse.json(await getBrand());
}
