"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
      Table,
      TableBody,
      TableCell,
      TableHead,
      TableHeader,
      TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
      AlertDialog,
      AlertDialogAction,
      AlertDialogCancel,
      AlertDialogContent,
      AlertDialogDescription,
      AlertDialogFooter,
      AlertDialogHeader,
      AlertDialogTitle,
      AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Product {
      id: string;
      name: string;
      price: number;
      stock: number;
      category: { name: string } | null;
}

export default function VendorProductsPage() {
      const router = useRouter();
      const [products, setProducts] = useState<Product[]>([]);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
            fetchProducts();
      }, []);

      const fetchProducts = async () => {
            try {
                  const response = await api.get("/products");
                  // Filter for current vendor's products (Ideally API should do this, but reusing public endpoint for now and filtering client side if needed, or better use a vendor-specific endpoint. 
                  // Checking my backend: `getVendorAnalytics` gets vendor products but `getProducts` gets all. 
                  // I should filter. But wait, `getProducts` returns everything. A vendor should see only theirs.
                  // I'll grab all and filter by checking ownership if the API returns vendorID. 
                  // Actually `getProducts` returns `vendor` relation. I can filter by current user's vendor ID.
                  // Better yet, I'll rely on the backend to filter if I had a dedicated endpoint. 
                  // For now, I'll fetch all and filter in frontend OR assume the user is honest, which is bad.
                  // I will filter by getting the current user's vendor ID from profile first? 
                  // Simplified: I'll accept seeing all for now in this demo or just implement the filter basic.

                  const user = JSON.parse(localStorage.getItem("user") || "{}");
                  // Actually, I don't have the vendor ID handy in the user object unless I updated login response.
                  // Login response: { token, user: { id, email, name, role } }. No vendor ID.
                  // I'll fetch profile to get vendor ID.

                  const profile = await api.get("/users/profile");
                  const vendorId = profile.data.vendor?.id;

                  const myProducts = response.data.filter((p: any) => p.vendorId === vendorId);
                  setProducts(myProducts);
            } catch (error) {
                  toast.error("Failed to load products");
            } finally {
                  setLoading(false);
            }
      };

      const handleDelete = async (id: string) => {
            try {
                  await api.delete(`/products/${id}`);
                  toast.success("Product deleted");
                  fetchProducts();
            } catch (error) {
                  toast.error("Failed to delete product");
            }
      };

      if (loading) return <div>Loading...</div>;

      return (
            <div className="space-y-4">
                  <div className="flex justify-between items-center">
                        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
                        <div className="flex gap-2">
                              {products.length < 10 && (
                                    <Button variant="outline" onClick={() => router.push("/vendor/products/bulk")}>
                                          <Plus className="mr-2 h-4 w-4" /> Bulk Add Products
                                    </Button>
                              )}
                              <Button onClick={() => router.push("/vendor/products/new")}>
                                    <Plus className="mr-2 h-4 w-4" /> Create Product
                              </Button>
                        </div>
                  </div>

                  <div className="border rounded-md">
                        <Table>
                              <TableHeader>
                                    <TableRow>
                                          <TableHead>Name</TableHead>
                                          <TableHead>Price</TableHead>
                                          <TableHead>Stock</TableHead>
                                          <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                              </TableHeader>
                              <TableBody>
                                    {products.map((product) => (
                                          <TableRow key={product.id}>
                                                <TableCell className="font-medium">{product.name}</TableCell>
                                                <TableCell>${product.price.toFixed(2)}</TableCell>
                                                <TableCell>{product.stock}</TableCell>
                                                <TableCell className="text-right space-x-2">
                                                      <Button variant="ghost" size="icon" onClick={() => router.push(`/vendor/products/${product.id}`)}>
                                                            <Pencil className="h-4 w-4" />
                                                      </Button>

                                                      <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                                                                        <Trash2 className="h-4 w-4" />
                                                                  </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                  <AlertDialogHeader>
                                                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                              This action cannot be undone. This will permanently delete the product.
                                                                        </AlertDialogDescription>
                                                                  </AlertDialogHeader>
                                                                  <AlertDialogFooter>
                                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                        <AlertDialogAction onClick={() => handleDelete(product.id)}>Delete</AlertDialogAction>
                                                                  </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                      </AlertDialog>
                                                </TableCell>
                                          </TableRow>
                                    ))}
                                    {products.length === 0 && (
                                          <TableRow>
                                                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                                      No products found. Create one to get started.
                                                </TableCell>
                                          </TableRow>
                                    )}
                              </TableBody>
                        </Table>
                  </div>
            </div>
      );
}
