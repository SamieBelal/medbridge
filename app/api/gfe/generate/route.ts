import { NextResponse } from "next/server";
import { generateGFE } from "@/lib/gfe/generator";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { providerName, providerNPI, providerAddress, patientName, serviceDate, items } = body;

    if (!providerName || !items?.length) {
      return NextResponse.json({ error: "providerName and items required" }, { status: 400 });
    }

    const gfe = generateGFE({
      providerName,
      providerNPI: providerNPI || "",
      providerAddress: providerAddress || "",
      patientName: patientName || "Self-Pay Patient",
      serviceDate: serviceDate || new Date().toISOString(),
      items,
    });

    return NextResponse.json(gfe);
  } catch {
    return NextResponse.json({ error: "Failed to generate GFE" }, { status: 500 });
  }
}
