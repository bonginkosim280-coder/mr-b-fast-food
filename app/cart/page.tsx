"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

const currency = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
});

export default function CartPage() {
  const { items, addItem, removeItem, totalPrice } = useCart();

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold">Your Cart</h1>

      {items.length === 0 ? (
        <div className="mt-6 rounded-lg border p-6">
          <p>Your cart is empty.</p>
          <Link
            href="/"
            className="mt-3 inline-block font-semibold text-orange-700 underline"
          >
            Browse the menu
          </Link>
        </div>
      ) : (
        <>
          <ul className="mt-6 divide-y rounded-lg border">
            {items.map((item) => {
              const lineTotal =
                (Math.round(item.price * 100) * item.quantity) / 100;

              return (
                <li
                  key={item.id}
                  className="flex flex-col gap-4 p-4 sm:flex-row sm:justify-between"
                >
                  <div>
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <p className="text-sm text-gray-600">
                      {currency.format(item.price)} each · Quantity: {item.quantity}
                    </p>
                    <p className="mt-1 font-medium">
                      Item total: {currency.format(lineTotal)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      aria-label={`Increase quantity of ${item.name}`}
                      onClick={() =>
                        addItem({
                          id: item.id,
                          name: item.name,
                          price: item.price,
                        })
                      }
                      className="rounded-md bg-orange-700 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-800"
                    >
                      Increase Quantity
                    </button>

                    <button
                      type="button"
                      aria-label={`Remove ${item.name} from cart`}
                      onClick={() => removeItem(item.id)}
                      className="rounded-md border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                    >
                      Remove Item
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <Link href="/" className="font-semibold text-orange-700 underline">
              Continue shopping
            </Link>
            <p className="text-lg font-bold" aria-live="polite">
              Cart total: {currency.format(totalPrice)}
            </p>
          </div>
          <Link
  href="/checkout"
  className="mt-6 block w-full rounded-md bg-green-600 px-6 py-3 text-center font-bold text-white hover:bg-green-700 transition"
>
  Proceed to Checkout
</Link>
        </>
      )}
    </main>
  );
}