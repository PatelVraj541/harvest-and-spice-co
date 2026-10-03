import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Check auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Please sign in to place an order" }, { status: 401 });
    }

    const body = await request.json();
    const { items, shippingAddress, notes } = body;

    // Validate inputs
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.line1 || !shippingAddress.city || !shippingAddress.state || !shippingAddress.postalCode) {
      return NextResponse.json({ error: "Please fill in all required address fields" }, { status: 400 });
    }

    // Calculate totals
    const subtotalCents = items.reduce(
      (sum: number, item: { unitPriceCents: number; quantity: number }) =>
        sum + item.unitPriceCents * item.quantity,
      0
    );
    const shippingCents = 0; // Free shipping
    const totalCents = subtotalCents + shippingCents;

    // Generate order number: HSC-YYYYMMDD-XXXX
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderNumber = `HSC-${dateStr}-${randomSuffix}`;

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        order_number: orderNumber,
        status: "confirmed",
        payment_method: "cod",
        subtotal_cents: subtotalCents,
        shipping_cents: shippingCents,
        tax_cents: 0,
        total_cents: totalCents,
        shipping_address: shippingAddress,
        notes: notes || null,
      })
      .select("id, order_number")
      .single();

    if (orderError) {
      console.error("Order creation error:", orderError);
      return NextResponse.json({ error: "Failed to create order. Please try again." }, { status: 500 });
    }

    // Create order items
    const orderItems = items.map((item: {
      variantId: string;
      productName: string;
      variantLabel: string;
      unitPriceCents: number;
      quantity: number;
    }) => ({
      order_id: order.id,
      variant_id: item.variantId,
      product_name: item.productName,
      variant_label: item.variantLabel,
      quantity: item.quantity,
      unit_price_cents: item.unitPriceCents,
      total_cents: item.unitPriceCents * item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Order items error:", itemsError);
    }

    return NextResponse.json({
      success: true,
      orderNumber: order.order_number,
      orderId: order.id,
    });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
