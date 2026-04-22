import { getStripe } from "./client";
import type Stripe from "stripe";

interface CheckoutParams {
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[];
  mode: "payment" | "subscription";
  customerEmail?: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

export async function createCheckoutSession({
  lineItems,
  mode,
  customerEmail,
  successUrl,
  cancelUrl,
  metadata,
}: CheckoutParams) {
  const session = await getStripe().checkout.sessions.create({
    line_items: lineItems,
    mode,
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: customerEmail,
    metadata,
    shipping_address_collection:
      mode === "payment"
        ? { allowed_countries: ["IN"] }
        : undefined,
  });

  return session;
}

export function formatAmountForStripe(
  amount: number,
  currency: string = "inr"
): number {
  // Stripe expects amounts in the smallest currency unit (paise for INR)
  return Math.round(amount);
}

export function formatAmountFromStripe(
  amount: number,
  currency: string = "inr"
): number {
  return amount / 100;
}
