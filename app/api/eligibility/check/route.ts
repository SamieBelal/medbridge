import { NextResponse } from "next/server";
import { checkEligibility } from "@/lib/availity/client";
import type { EligibilityRequest } from "@/lib/availity/types";

export async function POST(request: Request) {
  try {
    const body: EligibilityRequest = await request.json();

    if (!body.payerId || !body.memberId) {
      return NextResponse.json(
        { error: "payerId and memberId are required" },
        { status: 400 }
      );
    }

    const result = await checkEligibility(body);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Failed to check eligibility" },
      { status: 500 }
    );
  }
}
