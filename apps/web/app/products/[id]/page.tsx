"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCart } from "@/context/cart-context";
import { useParams } from "next/navigation";
import Image from "next/image";

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

export default function ProductDetailsPage() {
      const { id } = useParams();
      const [product, setProduct] = useState<Product | null>(null);
      const [loading, setLoading] = useState(true);
      const { addItem } = useCart();

      useEffect(() => {
            if (id) {
                  fetchProduct(id as string);
            }
      }, [id]);

      const fetchProduct = async (productId: string) => {
            try {
                  const { data } = await api.get(`/products/${productId}`);
                  setProduct(data);
            } catch (error) {
                  toast.error("Failed to load product details");
            } finally {
                  setLoading(false);
            }
      };

      const handleAddToCart = () => {
            if (product) {
                  addItem(product);
            }
      };

      if (loading) return <div className="p-8 text-center">Loading...</div>;
      if (!product) return <div className="p-8 text-center">Product not found</div>;

      // Get the first image URL from comma-separated list
      const getMainImage = () => {
            if (!product.images || product.images.trim() === "") return null;
            const urls = product.images.split(",").map(url => url.trim()).filter(url => url !== "");
            return urls.length > 0 ? urls[0] : null;
      };

      const mainImage = getMainImage();

      return (
            <div className="container mx-auto p-4 py-8">
                  <div className="grid md:grid-cols-2 gap-8">
                        {/* Image Section */}
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg h-[400px] flex items-center justify-center overflow-hidden">
                              {mainImage ? (
                                    <img
                                          src={mainImage}
                                          alt={product.name}
                                          className="object-cover h-full w-full"
                                          onError={(e) => {
                                                // Replace with placeholder on error
                                                (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 200 200'%3E%3Crect fill='%23e5e7eb' width='200' height='200'/%3E%3Cpath fill='%239ca3af' d='M100 85c-8.3 0-15 6.7-15 15s6.7 15 15 15 15-6.7 15-15-6.7-15-15-15zm0 0'/%3E%3Cpath fill='%239ca3af' d='M150 60H50c-5.5 0-10 4.5-10 10v60c0 5.5 4.5 10 10 10h100c5.5 0 10-4.5 10-10V70c0-5.5-4.5-10-10-10zm0 70H50V70h100v60z'/%3E%3C/svg%3E";
                                          }}
                                    />
                              ) : (
                                    <div className="flex flex-col items-center justify-center text-gray-400">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                                <circle cx="8.5" cy="8.5" r="1.5" />
                                                <polyline points="21 15 16 10 5 21" />
                                          </svg>
                                          <span className="text-xl mt-4">No Image Available</span>
                                    </div>
                              )}
                        </div>

                        {/* Details Section */}
                        <div className="flex flex-col gap-4">
                              <div>
                                    <h1 className="text-3xl font-bold">{product.name}</h1>
                                    <p className="text-lg text-gray-500 dark:text-gray-400">
                                          Sold by {product.vendor.storeName}
                                    </p>
                              </div>

                              <div className="text-4xl font-bold text-primary">
                                    ${product.price.toFixed(2)}
                              </div>

                              <div className="prose dark:prose-invert max-w-none">
                                    <p>{product.description}</p>
                              </div>

                              <div className="mt-auto pt-8">
                                    <div className="flex items-center gap-4">
                                          {product.stock > 0 ? (
                                                <Button size="lg" className="w-full md:w-auto" onClick={handleAddToCart}>
                                                      Add to Cart
                                                </Button>
                                          ) : (
                                                <Button size="lg" disabled variant="secondary" className="w-full md:w-auto">
                                                      Out of Stock
                                                </Button>
                                          )}
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500">
                                          {product.stock > 0 ? `${product.stock} units available` : "Restocking soon"}
                                    </p>
                              </div>
                        </div>
                  </div>
            </div>
      );
}
