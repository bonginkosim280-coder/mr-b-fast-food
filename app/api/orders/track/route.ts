import { createClient } from "@supabase/supabase-js";

const uuidPattern = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;

function json(body: object, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const id = typeof body?.id === "string" ? body.id.trim() : "";

  if (!uuidPattern.test(id)) {
    return json({ error: "Enter your full order number." }, 400);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return json({ error: "Order tracking is temporarily unavailable." }, 503);
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabase
    .from("orders")
    .select("order_status")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Order tracking lookup failed:", error.code);
    return json({ error: "Could not check the order. Please try again." }, 500);
  }

  if (!data) {
    return json({ error: "Order not found. Check your order number." }, 404);
  }

  return json({ status: data.order_status });
}