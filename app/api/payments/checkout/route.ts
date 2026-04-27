import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { serviceId, providerId, appointmentAt, amount } = body;

    if (!serviceId || !amount) {
      return NextResponse.json({ error: "serviceId and amount required" }, { status: 400 });
    }

    // In production: create a Stripe Checkout session
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    // const session = await stripe.checkout.sessions.create({
    //   payment_method_types: ["card"],
    //   line_items: [{ price_data: { currency: "usd", product_data: { name: serviceName }, unit_amount: amount }, quantity: 1 }],
    //   mode: "payment",
    //   success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?booking=success`,
    //   cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/book/${providerSlug}?cancelled=true`,
    //   metadata: { serviceId, providerId, appointmentAt },
    // });
    // return NextResponse.json({ url: session.url });

    // Stub: return a mock session URL
    return NextResponse.json({
      url: "/dashboard?booking=success",
      sessionId: "cs_test_mock_" + Date.now(),
    });
  } catch {
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
