"use client";

import { ProductForm } from "@/features/vendor/components/product-form";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useParams } from "next/navigation";

export default function EditProductPage() {
      const { id } = useParams();
      const [product, setProduct] = useState(null);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
            if (id) fetchProduct();
      }, [id]);

      const fetchProduct = async () => {
            try {
                  const { data } = await api.get(`/products/${id}`);
                  setProduct(data);
            } catch (error) {
                  console.error(error);
            } finally {
                  setLoading(false);
            }
      };

      if (loading) return <div>Loading...</div>;
      if (!product) return <div>Product not found</div>;

      return (
            <div className="space-y-6">
                  <h1 className="text-3xl font-bold">Edit Product</h1>
                  <ProductForm initialData={product} />
            </div>
      );
}
