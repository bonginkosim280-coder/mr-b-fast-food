"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { useCart } from "@/context/CartContext";

const currency = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
});

const fieldClass = "mt-1 block w-full rounded-md border px-3 py-2";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const submitting = useRef(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function placeOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current || items.length === 0) return;

    const form = new FormData(event.currentTarget);
    submitting.current = true;
    setBusy(true);
    setError("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: form.get("customer_name"),
          customer_phone: form.get("customer_phone"),
          fulfillment_type: form.get("fulfillment_type"),
          total_price: totalPrice,
          items: items.map((item) => ({
            menu_item_id: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Could not confirm your order.");
      }

      clearCart();
      router.replace("/thank-you");
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not confirm your order.");
      submitting.current = false;
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-8">
      <h1 className="text-3xl font-bold">Checkout</h1>

      {items.length === 0 && !busy ? (
        <div className="mt-6">
          <p>Your cart is empty.</p>
          <Link href="/" className="mt-2 inline-block underline">
            Browse the menu
          </Link>
        </div>
      ) : (
        <form onSubmit={placeOrder} className="mt-6 space-y-4">
          <fieldset disabled={busy} className="space-y-4">
            <label className="block">
              Full name
              <input
                name="customer_name"
                autoComplete="name"
                required
                maxLength={120}
                className={fieldClass}
              />
            </label>

            <label className="block">
              Phone number
              <input
                name="customer_phone"
                type="tel"
                autoComplete="tel"
                required
                maxLength={32}
                className={fieldClass}
              />
            </label>

            <label className="block">
              Fulfillment method
              <select
                name="fulfillment_type"
                defaultValue="pickup"
                className={fieldClass}
              >
                <option value="pickup">Pickup</option>
                <option value="delivery">Delivery</option>
              </select>
            </label>

            <p className="font-semibold">
              Estimated total: {currency.format(totalPrice)}
            </p>

            <button
              type="submit"
              className="w-full rounded-md bg-orange-700 px-4 py-2 font-semibold text-white disabled:opacity-60"
            >
              {busy ? "Placing order…" : "Place Order"}
            </button>
          </fieldset>

          {error && <p role="alert" className="text-red-700">{error}</p>}
        </form>
      )}
    </main>
  );
}