import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return NextResponse.json(
      { error: "Checkout is temporarily unavailable (missing keys)." },
      { status: 500 }
    );
  }

  // This client runs on the SERVER, so it can safely use the secret key
  const supabaseAdmin = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    const body = await request.json();
    const { customer_name, customer_phone, fulfillment_type, total_price, items } = body;

    // 1. Insert the order
    const { data: orderData, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        customer_name,
        customer_phone,
        fulfillment_type,
        total_price,
        order_status: "pending",
      })
      .select("id")
      .single();

    if (orderError) throw new Error(orderError.message);

    // 2. Insert the order items
    const orderItems = items.map((item: any) => ({
      order_id: orderData.id,
      menu_item_id: item.menu_item_id,
      quantity: item.quantity,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(orderItems);

    if (itemsError) throw new Error(itemsError.message);

    // 3. Return success
    return NextResponse.json({ orderId: orderData.id }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to place order" },
      { status: 500 }
    );
  }
}