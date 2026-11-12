"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

export type CartProduct = {
  id: string;
  name: string;
  price: number;
};

export type CartItem = CartProduct & {
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (product: CartProduct) => void;
  removeItem: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextValue | undefined>(
  undefined
);

// Calculate money in cents to reduce floating-point errors.
function toCents(price: number) {
  return Math.round(price * 100);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  function addItem(product: CartProduct) {
    if (!Number.isFinite(product.price) || product.price < 0) {
      throw new Error("The product price must be a valid positive amount.");
    }

    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...currentItems,
        {
          ...product,
          price: toCents(product.price) / 100,
          quantity: 1,
        },
      ];
    });
  }

  // Remove the entire item, regardless of its quantity.
  function removeItem(id: string) {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== id)
    );
  }

  // Remove one unit; remove the item if its quantity reaches zero.
  function decreaseQuantity(id: string) {
    setItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function clearCart() {
    setItems([]);
  }

  const totalItems = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const totalPrice =
    items.reduce(
      (total, item) =>
        total + toCents(item.price) * item.quantity,
      0
    ) / 100;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        decreaseQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error("useCart must be used inside a CartProvider.");
  }

  return context;
}