import { NextResponse } from "next/server";
import { getGrill } from "@/services/grill.service";

/** GET /api/grill */
export async function GET() {
  return NextResponse.json(await getGrill());
}
