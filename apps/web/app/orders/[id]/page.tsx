"use client";

import { useEffect, useState } from "react";
import { api, getToken } from "@/lib/api";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface OrderDetail {
      id: string;
      total: number;
      status: string;
      createdAt: string;
      items: {
            id: string;
            product: {
                  name: string;
                  images: string;
            };
            quantity: number;
            price: number;
      }[];
}

export default function OrderDetailsPage() {
      const router = useRouter();
      const { id } = useParams();
      const [order, setOrder] = useState<OrderDetail | null>(null);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
            if (id) fetchOrder();
      }, [id]);

      const fetchOrder = async () => {
            try {
                  const { data } = await api.get(`/orders/${id}`);
                  setOrder(data);
            } catch (error) {
                  toast.error("Failed to load order details");
            } finally {
                  setLoading(false);
            }
      };

      if (loading) return <div className="p-8 text-center">Loading...</div>;
      if (!order) return <div className="p-8 text-center">Order not found</div>;

      return (
            <div className="container mx-auto p-4 py-8 max-w-3xl">
                  <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-bold">Order Details</h1>
                        <Button variant="outline" onClick={() => router.push("/orders")}>Back to Orders</Button>
                  </div>

                  <Card className="mb-6">
                        <CardHeader>
                              <div className="flex justify-between items-center">
                                    <div>
                                          <CardTitle>Order #{order.id.slice(0, 8)}</CardTitle>
                                          <p className="text-sm text-gray-500 mt-1">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 uppercase">
                                          {order.status}
                                    </div>
                              </div>
                        </CardHeader>
                        <CardContent>
                              <div className="space-y-4">
                                    {order.items.map((item) => (
                                          <div key={item.id} className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0">
                                                <div className="flex items-center gap-4">
                                                      <div className="h-16 w-16 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center overflow-hidden">
                                                            {item.product.images ? (
                                                                  <img src={item.product.images.split(",")[0]} alt={item.product.name} className="object-cover h-full w-full" />
                                                            ) : (
                                                                  <span className="text-xs text-gray-400">No Image</span>
                                                            )}
                                                      </div>
                                                      <div>
                                                            <p className="font-medium">{item.product.name}</p>
                                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                      </div>
                                                </div>
                                                <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                                          </div>
                                    ))}
                              </div>
                              <div className="mt-6 pt-6 border-t flex justify-between items-center">
                                    <span className="text-xl font-bold">Total</span>
                                    <span className="text-xl font-bold text-primary">${order.total.toFixed(2)}</span>
                              </div>
                        </CardContent>
                  </Card>

                  <div className="text-center text-sm text-gray-500">
                        <p>This is a mock order verification.</p>
                  </div>
            </div>
      );
}
