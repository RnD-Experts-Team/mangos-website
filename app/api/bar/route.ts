import { NextResponse } from "next/server";
import { getBar } from "@/services/bar.service";

/** GET /api/bar */
export async function GET() {
  return NextResponse.json(await getBar());
}
