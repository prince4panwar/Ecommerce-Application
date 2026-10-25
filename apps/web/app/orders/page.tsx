"use client";

import { useEffect, useState } from "react";
import { api, getToken } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";

interface Order {
      id: string;
      total: number;
      status: string;
      createdAt: string;
      items: any[];
}

export default function OrdersPage() {
      const router = useRouter();
      const [orders, setOrders] = useState<Order[]>([]);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
            const token = getToken();
            if (!token) {
                  router.push("/login?redirect=/orders");
                  return;
            }
            fetchOrders();
      }, [router]);

      const fetchOrders = async () => {
            try {
                  const { data } = await api.get("/orders");
                  setOrders(data);
            } catch (error) {
                  toast.error("Failed to load orders");
            } finally {
                  setLoading(false);
            }
      };

      if (loading) return <div className="p-8 text-center">Loading...</div>;

      return (
            <div className="container mx-auto p-4 py-8">
                  <h1 className="text-3xl font-bold mb-8">Order History</h1>

                  {orders.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50 dark:bg-gray-900 rounded-lg">
                              <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
                              <Button onClick={() => router.push("/products")}>Start Shopping</Button>
                        </div>
                  ) : (
                        <div className="space-y-4">
                              {orders.map((order) => (
                                    <Card key={order.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push(`/orders/${order.id}`)}>
                                          <CardHeader className="flex flex-row items-center justify-between pb-2">
                                                <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
                                                <div className="text-sm text-gray-500">
                                                      {new Date(order.createdAt).toLocaleDateString()}
                                                </div>
                                          </CardHeader>
                                          <CardContent>
                                                <div className="flex justify-between items-center">
                                                      <div>
                                                            <p className="font-semibold text-primary">${order.total.toFixed(2)}</p>
                                                            <p className="text-sm text-gray-500">{order.items.length} items</p>
                                                      </div>
                                                      <div className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 uppercase">
                                                            {order.status}
                                                      </div>
                                                </div>
                                          </CardContent>
                                    </Card>
                              ))}
                        </div>
                  )}
            </div>
      );
}
