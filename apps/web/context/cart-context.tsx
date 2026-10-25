"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

export interface CartItem {
      productId: string;
      name: string;
      price: number;
      quantity: number;
      image?: string;
}

interface CartContextType {
      items: CartItem[];
      addItem: (product: any, quantity?: number) => void;
      removeItem: (productId: string) => void;
      updateQuantity: (productId: string, quantity: number) => void;
      clearCart: () => void;
      total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
      const [items, setItems] = useState<CartItem[]>([]);

      useEffect(() => {
            const saved = localStorage.getItem("cart");
            if (saved) {
                  try {
                        setItems(JSON.parse(saved));
                  } catch (e) {
                        console.error("Failed to parse cart", e);
                  }
            }
      }, []);

      useEffect(() => {
            localStorage.setItem("cart", JSON.stringify(items));
      }, [items]);

      const addItem = (product: any, quantity = 1) => {
            setItems((prev) => {
                  const existing = prev.find((item) => item.productId === product.id);
                  if (existing) {
                        toast.success("Updated cart quantity");
                        return prev.map((item) =>
                              item.productId === product.id
                                    ? { ...item, quantity: item.quantity + quantity }
                                    : item
                        );
                  }
                  toast.success("Added to cart");
                  return [
                        ...prev,
                        {
                              productId: product.id,
                              name: product.name,
                              price: product.price,
                              quantity,
                              image: product.images ? product.images.split(",")[0] : undefined,
                        },
                  ];
            });
      };

      const removeItem = (productId: string) => {
            setItems((prev) => prev.filter((item) => item.productId !== productId));
            toast.success("Removed from cart");
      };

      const updateQuantity = (productId: string, quantity: number) => {
            if (quantity <= 0) {
                  removeItem(productId);
                  return;
            }
            setItems((prev) =>
                  prev.map((item) =>
                        item.productId === productId ? { ...item, quantity } : item
                  )
            );
      };

      const clearCart = () => {
            setItems([]);
      };

      const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

      return (
            <CartContext.Provider
                  value={{ items, addItem, removeItem, updateQuantity, clearCart, total }}
            >
                  {children}
            </CartContext.Provider>
      );
}

export const useCart = () => {
      const context = useContext(CartContext);
      if (context === undefined) {
            throw new Error("useCart must be used within a CartProvider");
      }
      return context;
};
