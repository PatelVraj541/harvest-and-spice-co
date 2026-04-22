"use client";

import { useCartStore, type CartItem } from "@/stores/cart-store";
import { formatPrice } from "@/lib/utils/format";

export function useCart() {
  const {
    items,
    isOpen,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    totalItems,
    subtotalCents,
  } = useCartStore();

  const subtotal = subtotalCents();
  const count = totalItems();
  const formattedSubtotal = formatPrice(subtotal);

  return {
    items,
    isOpen,
    count,
    subtotal,
    formattedSubtotal,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
  };
}
