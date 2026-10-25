"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { ProductCard } from "@/features/products/components/product-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Search } from "lucide-react";

interface Product {
      id: string;
      name: string;
      description: string;
      price: number;
      images: string;
      stock: number;
      vendor: {
            storeName: string;
      };
}

export default function ProductsPage() {
      const [products, setProducts] = useState<Product[]>([]);
      const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
      const [loading, setLoading] = useState(true);
      const [search, setSearch] = useState("");

      useEffect(() => {
            fetchProducts();
      }, []);

      useEffect(() => {
            if (!search.trim()) {
                  setFilteredProducts(products);
            } else {
                  const query = search.toLowerCase();
                  setFilteredProducts(
                        products.filter(
                              (p) =>
                                    p.name.toLowerCase().includes(query) ||
                                    p.description.toLowerCase().includes(query)
                        )
                  );
            }
      }, [search, products]);

      const fetchProducts = async () => {
            try {
                  const { data } = await api.get("/products");
                  setProducts(data);
                  setFilteredProducts(data);
            } catch (error) {
                  toast.error("Failed to load products");
            } finally {
                  setLoading(false);
            }
      };

      return (
            <div className="container mx-auto p-4">
                  <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-between items-center">
                        <h1 className="text-3xl font-bold">Products</h1>
                        <div className="flex w-full sm:w-auto max-w-sm items-center space-x-2">
                              <Input
                                    type="search"
                                    placeholder="Search products..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                              />
                              <Button type="submit" size="icon">
                                    <Search className="h-4 w-4" />
                              </Button>
                        </div>
                  </div>

                  {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                              {[...Array(8)].map((_, i) => (
                                    <div key={i} className="h-80 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />
                              ))}
                        </div>
                  ) : filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                              {filteredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                              ))}
                        </div>
                  ) : (
                        <div className="text-center py-20 text-gray-500">
                              No products found.
                        </div>
                  )}
            </div>
      );
}
