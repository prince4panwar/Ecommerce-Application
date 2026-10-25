"use client";

import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Minus } from "lucide-react";
import Image from "next/image";

export default function CartPage() {
      const { items, removeItem, updateQuantity, total } = useCart();
      const router = useRouter();

      if (items.length === 0) {
            return (
                  <div className="container mx-auto p-8 text-center">
                        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
                        <Button onClick={() => router.push("/products")}>Browse Products</Button>
                  </div>
            );
      }

      return (
            <div className="container mx-auto p-4 py-8">
                  <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

                  <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                              {items.map((item) => (
                                    <Card key={item.productId} className="flex flex-row items-center p-4 gap-4">
                                          <div className="h-24 w-24 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center overflow-hidden flex-shrink-0">
                                                {item.image ? (
                                                      <img src={item.image} alt={item.name} className="object-cover h-full w-full" />
                                                ) : (
                                                      <span className="text-xs text-gray-400">No Image</span>
                                                )}
                                          </div>
                                          <div className="flex-1">
                                                <h3 className="font-semibold text-lg">{item.name}</h3>
                                                <p className="text-gray-500">${item.price.toFixed(2)}</p>
                                          </div>

                                          <div className="flex items-center gap-2">
                                                <Button
                                                      variant="outline" size="icon" className="h-8 w-8"
                                                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                >
                                                      <Minus className="h-4 w-4" />
                                                </Button>
                                                <span className="w-8 text-center">{item.quantity}</span>
                                                <Button
                                                      variant="outline" size="icon" className="h-8 w-8"
                                                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                >
                                                      <Plus className="h-4 w-4" />
                                                </Button>
                                          </div>

                                          <Button
                                                variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                                                onClick={() => removeItem(item.productId)}
                                          >
                                                <Trash2 className="h-5 w-5" />
                                          </Button>
                                    </Card>
                              ))}
                        </div>

                        <div className="lg:col-span-1">
                              <Card>
                                    <CardContent className="p-6 space-y-4">
                                          <h2 className="text-xl font-bold">Order Summary</h2>
                                          <div className="flex justify-between text-lg">
                                                <span>Subtotal</span>
                                                <span>${total.toFixed(2)}</span>
                                          </div>
                                          <div className="flex justify-between text-lg">
                                                <span>Shipping</span>
                                                <span>Free</span>
                                          </div>
                                          <div className="border-t pt-4 flex justify-between text-xl font-bold text-primary">
                                                <span>Total</span>
                                                <span>${total.toFixed(2)}</span>
                                          </div>

                                          <Button className="w-full mt-4" size="lg" onClick={() => router.push("/checkout")}>
                                                Proceed to Checkout
                                          </Button>
                                    </CardContent>
                              </Card>
                        </div>
                  </div>
            </div>
      );
}
