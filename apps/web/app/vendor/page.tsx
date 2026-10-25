"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { DollarSign, Package, ShoppingBag } from "lucide-react";
import {
      Table,
      TableBody,
      TableCell,
      TableHead,
      TableHeader,
      TableRow,
} from "@/components/ui/table";

interface AnalyticsData {
      totalProducts: number;
      totalRevenue: number;
      totalSalesCount: number;
      recentSales: any[];
}

export default function VendorDashboardPage() {
      const [data, setData] = useState<AnalyticsData | null>(null);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
            fetchAnalytics();
      }, []);

      const fetchAnalytics = async () => {
            try {
                  const response = await api.get("/analytics/vendor");
                  setData(response.data);
            } catch (error) {
                  //   toast.error("Failed to load analytics");
                  console.error(error);
            } finally {
                  setLoading(false);
            }
      };

      if (loading) return <div>Loading...</div>;
      if (!data) return <div>Failed to load data</div>;

      return (
            <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                              </CardHeader>
                              <CardContent>
                                    <div className="text-2xl font-bold">${data.totalRevenue.toFixed(2)}</div>
                                    <p className="text-xs text-muted-foreground">Lifetime earnings</p>
                              </CardContent>
                        </Card>
                        <Card>
                              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Sales</CardTitle>
                                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                              </CardHeader>
                              <CardContent>
                                    <div className="text-2xl font-bold">+{data.totalSalesCount}</div>
                                    <p className="text-xs text-muted-foreground">Total items sold</p>
                              </CardContent>
                        </Card>
                        <Card>
                              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Products</CardTitle>
                                    <Package className="h-4 w-4 text-muted-foreground" />
                              </CardHeader>
                              <CardContent>
                                    <div className="text-2xl font-bold">{data.totalProducts}</div>
                                    <p className="text-xs text-muted-foreground">Active listings</p>
                              </CardContent>
                        </Card>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4">
                              <CardHeader>
                                    <CardTitle>Recent Sales</CardTitle>
                              </CardHeader>
                              <CardContent>
                                    <Table>
                                          <TableHeader>
                                                <TableRow>
                                                      <TableHead>Product ID</TableHead>
                                                      <TableHead className="text-right">Amount</TableHead>
                                                </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                                {data.recentSales.map((sale: any) => (
                                                      <TableRow key={sale.id}>
                                                            <TableCell className="font-medium">{sale.productId.slice(0, 8)}...</TableCell>
                                                            <TableCell className="text-right">${sale.price.toFixed(2)}</TableCell>
                                                      </TableRow>
                                                ))}
                                                {data.recentSales.length === 0 && (
                                                      <TableRow>
                                                            <TableCell colSpan={2} className="text-center">No sales yet</TableCell>
                                                      </TableRow>
                                                )}
                                          </TableBody>
                                    </Table>
                              </CardContent>
                        </Card>
                  </div>
            </div>
      );
}
