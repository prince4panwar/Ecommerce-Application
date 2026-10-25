"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
      Table,
      TableBody,
      TableCell,
      TableHead,
      TableHeader,
      TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface VendorOrder {
      id: string;
      createdAt: string;
      status: string;
      customer: {
            user: {
                  name: string;
                  email: string;
            }
      };
      items: {
            id: string;
            quantity: number;
            price: number;
            product: {
                  name: string;
            }
      }[];
}

export default function VendorOrdersPage() {
      const [orders, setOrders] = useState<VendorOrder[]>([]);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
            fetchOrders();
      }, []);

      const fetchOrders = async () => {
            try {
                  const { data } = await api.get("/orders/vendor");
                  setOrders(data);
            } catch (error) {
                  toast.error("Failed to load orders");
            } finally {
                  setLoading(false);
            }
      };

      if (loading) return <div>Loading...</div>;

      return (
            <div className="space-y-4">
                  <h2 className="text-3xl font-bold tracking-tight">Orders</h2>

                  <Card>
                        <CardHeader>
                              <CardTitle>Recent Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                              <Table>
                                    <TableHeader>
                                          <TableRow>
                                                <TableHead>Order ID</TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Customer</TableHead>
                                                <TableHead>Items</TableHead>
                                                <TableHead>Total (My Share)</TableHead>
                                                <TableHead>Status</TableHead>
                                          </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                          {orders.map((order) => {
                                                const myTotal = order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
                                                return (
                                                      <TableRow key={order.id}>
                                                            <TableCell className="font-medium">#{order.id.slice(0, 8)}</TableCell>
                                                            <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                                            <TableCell>
                                                                  <div>{order.customer.user.name}</div>
                                                                  <div className="text-xs text-gray-500">{order.customer.user.email}</div>
                                                            </TableCell>
                                                            <TableCell>
                                                                  <ul className="list-disc list-inside text-sm">
                                                                        {order.items.map(item => (
                                                                              <li key={item.id}>{item.quantity}x {item.product.name}</li>
                                                                        ))}
                                                                  </ul>
                                                            </TableCell>
                                                            <TableCell>${myTotal.toFixed(2)}</TableCell>
                                                            <TableCell>
                                                                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 uppercase">
                                                                        {order.status}
                                                                  </span>
                                                            </TableCell>
                                                      </TableRow>
                                                );
                                          })}
                                          {orders.length === 0 && (
                                                <TableRow>
                                                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                                            No orders found.
                                                      </TableCell>
                                                </TableRow>
                                          )}
                                    </TableBody>
                              </Table>
                        </CardContent>
                  </Card>
            </div>
      );
}
