"use client";

import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api, getToken } from "@/lib/api";
import { toast } from "sonner";

export default function CheckoutPage() {
      const { items, total, clearCart } = useCart();
      const router = useRouter();
      const [loading, setLoading] = useState(false);

      useEffect(() => {
            if (items.length === 0) {
                  router.push("/cart");
            }
      }, [items, router]);

      const handleCheckout = async () => {
            const token = getToken();
            if (!token) {
                  toast.error("Please login to checkout");
                  router.push("/login?redirect=/checkout");
                  return;
            }

            setLoading(true);
            try {
                  // 1. Create Order
                  const orderPayload = {
                        items: items.map(item => ({
                              productId: item.productId,
                              quantity: item.quantity
                        }))
                  };

                  const { data: order } = await api.post("/orders", orderPayload);

                  // 2. Process Payment (Mock)
                  await api.post("/payments", {
                        orderId: order.id,
                        amount: total,
                        method: "CREDIT_CARD"
                  });

                  toast.success("Order placed successfully!");
                  clearCart();
                  router.push("/profile"); // Ideally to order details but profile is fine for now
            } catch (error: any) {
                  console.error(error);
                  toast.error(error.response?.data?.message || "Checkout failed");
            } finally {
                  setLoading(false);
            }
      };

      return (
            <div className="container mx-auto p-4 py-8 max-w-4xl">
                  <h1 className="text-3xl font-bold mb-8">Checkout</h1>

                  <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                              <Card>
                                    <CardHeader>
                                          <CardTitle>Shipping Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                          <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                      <Label>First Name</Label>
                                                      <Input placeholder="John" />
                                                </div>
                                                <div className="space-y-2">
                                                      <Label>Last Name</Label>
                                                      <Input placeholder="Doe" />
                                                </div>
                                          </div>
                                          <div className="space-y-2">
                                                <Label>Address</Label>
                                                <Input placeholder="123 Main St" />
                                          </div>
                                          <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                      <Label>City</Label>
                                                      <Input placeholder="New York" />
                                                </div>
                                                <div className="space-y-2">
                                                      <Label>ZIP Code</Label>
                                                      <Input placeholder="10001" />
                                                </div>
                                          </div>
                                    </CardContent>
                              </Card>

                              <Card>
                                    <CardHeader>
                                          <CardTitle>Payment Details</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                          <div className="space-y-2">
                                                <Label>Card Number</Label>
                                                <Input placeholder="0000 0000 0000 0000" />
                                          </div>
                                          <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                      <Label>Expiry</Label>
                                                      <Input placeholder="MM/YY" />
                                                </div>
                                                <div className="space-y-2">
                                                      <Label>CVC</Label>
                                                      <Input placeholder="123" />
                                                </div>
                                          </div>
                                    </CardContent>
                              </Card>
                        </div>

                        <div>
                              <Card>
                                    <CardHeader>
                                          <CardTitle>Order Summary</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                          {items.map((item) => (
                                                <div key={item.productId} className="flex justify-between items-center text-sm">
                                                      <span>{item.name} x {item.quantity}</span>
                                                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                                                </div>
                                          ))}

                                          <div className="border-t pt-4 flex justify-between text-xl font-bold text-primary">
                                                <span>Total</span>
                                                <span>${total.toFixed(2)}</span>
                                          </div>

                                          <Button className="w-full mt-4" size="lg" onClick={handleCheckout} disabled={loading}>
                                                {loading ? "Processing..." : "Place Order"}
                                          </Button>
                                    </CardContent>
                              </Card>
                        </div>
                  </div>
            </div>
      );
}
