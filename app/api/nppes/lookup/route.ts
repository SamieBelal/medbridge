import { NextResponse } from "next/server";
import { lookupNPI } from "@/lib/nppes/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const npi = searchParams.get("npi");

  if (!npi || npi.length !== 10) {
    return NextResponse.json({ error: "Valid 10-digit NPI required" }, { status: 400 });
  }

  const result = await lookupNPI(npi);

  if (!result) {
    return NextResponse.json({ error: "NPI not found" }, { status: 404 });
  }

  return NextResponse.json(result);
}
