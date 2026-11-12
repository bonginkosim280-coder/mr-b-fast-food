"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

const currency = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
});

export default function Header() {
  const { totalItems, totalPrice } = useCart();

  return (
    <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        
        {/* Logo links to Home */}
        <Link href="/" className="text-xl font-bold text-orange-600 hover:opacity-80">
          MR B Fast-food
        </Link>
        
        {/* Cart Icon and Total links to /cart */}
        <Link href="/cart" className="flex items-center gap-4 hover:opacity-80 transition cursor-pointer bg-gray-100 px-4 py-2 rounded-full">
          <span className="text-sm font-medium text-gray-600">
            Cart: <strong className="text-black">{totalItems}</strong>
          </span>
          <span className="font-bold text-green-600">
            {currency.format(totalPrice)}
          </span>
        </Link>

      </div>
    </header>
  );
}