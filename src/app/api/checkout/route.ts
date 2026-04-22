import { NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/stripe/helpers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { lineItems, mode = "payment", customerEmail, metadata } = body;

    if (!lineItems || lineItems.length === 0) {
      return NextResponse.json(
        { error: "No items provided" },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await createCheckoutSession({
      lineItems,
      mode,
      customerEmail,
      successUrl: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${appUrl}/cart`,
      metadata,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
