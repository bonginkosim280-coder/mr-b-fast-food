"use client";

import {
  useCart,
  type CartProduct,
} from "@/context/CartContext";

type Props = {
  product: CartProduct;
  disabled?: boolean;
};

export default function AddToCartButton({
  product,
  disabled = false,
}: Props) {
  const { addItem } = useCart();

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => addItem(product)}
      className="rounded-lg bg-orange-600 px-4 py-2 font-semibold
                 text-white hover:bg-orange-700
                 disabled:cursor-not-allowed disabled:bg-gray-400"
    >
      {disabled ? "Unavailable" : "Add to Cart"}
    </button>
  );
}