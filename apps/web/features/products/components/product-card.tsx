"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
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

interface ProductCardProps {
      product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
      const router = useRouter();

      // Get the first image URL from comma-separated list
      const getImageUrl = () => {
            if (!product.images || product.images.trim() === "") return null;
            const urls = product.images.split(",").map(url => url.trim()).filter(url => url !== "");
            return urls.length > 0 ? urls[0] : null;
      };

      const imageUrl = getImageUrl();

      return (
            <Card className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        {imageUrl ? (
                              <img
                                    src={imageUrl}
                                    alt={product.name}
                                    className="object-cover h-full w-full"
                                    onError={(e) => {
                                          // Replace with placeholder on error
                                          (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect fill='%23e5e7eb' width='200' height='200'/%3E%3Cpath fill='%239ca3af' d='M100 85c-8.3 0-15 6.7-15 15s6.7 15 15 15 15-6.7 15-15-6.7-15-15-15zm0 0'/%3E%3Cpath fill='%239ca3af' d='M150 60H50c-5.5 0-10 4.5-10 10v60c0 5.5 4.5 10 10 10h100c5.5 0 10-4.5 10-10V70c0-5.5-4.5-10-10-10zm0 70H50V70h100v60z'/%3E%3C/svg%3E";
                                    }}
                              />
                        ) : (
                              <div className="flex flex-col items-center justify-center text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                          <circle cx="8.5" cy="8.5" r="1.5" />
                                          <polyline points="21 15 16 10 5 21" />
                                    </svg>
                                    <span className="text-sm mt-2">No Image</span>
                              </div>
                        )}
                  </div>
                  <CardHeader>
                        <CardTitle className="text-lg line-clamp-1" title={product.name}>{product.name}</CardTitle>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{product.vendor.storeName}</p>
                  </CardHeader>
                  <CardContent className="flex-1">
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                              {product.description}
                        </p>
                        <div className="mt-4 font-bold text-lg">
                              ${product.price.toFixed(2)}
                        </div>
                  </CardContent>
                  <CardFooter>
                        <Button className="w-full" onClick={() => router.push(`/products/${product.id}`)}>
                              View Details
                        </Button>
                  </CardFooter>
            </Card>
      );
}
