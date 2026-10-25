"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
      Form,
      FormControl,
      FormField,
      FormItem,
      FormLabel,
      FormMessage,
      FormDescription,
} from "@/components/ui/form";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";

// Custom validation for comma-separated URLs
const validateImageUrls = (value: string | undefined) => {
      if (!value || value.trim() === "") return true; // Optional field

      const urls = value.split(",").map(url => url.trim()).filter(url => url !== "");

      for (const url of urls) {
            try {
                  new URL(url);
            } catch {
                  return false;
            }
      }
      return true;
};

const formSchema = z.object({
      name: z.string().min(2, "Name is required"),
      description: z.string().min(10, "Description must be at least 10 characters"),
      price: z.coerce.number().positive("Price must be positive"),
      stock: z.coerce.number().int().nonnegative("Stock cannot be negative"),
      categoryId: z.string().optional(),
      images: z.string()
            .optional()
            .refine(validateImageUrls, {
                  message: "All URLs must be valid. Separate multiple URLs with commas.",
            }),
});

interface ProductFormProps {
      initialData?: any;
}

export function ProductForm({ initialData }: ProductFormProps) {
      const router = useRouter();
      const [loading, setLoading] = useState(false);
      const [imagePreviews, setImagePreviews] = useState<string[]>([]);
      const isEditing = !!initialData;

      const form = useForm<z.infer<typeof formSchema>>({
            resolver: zodResolver(formSchema),
            defaultValues: initialData || {
                  name: "",
                  description: "",
                  price: 0,
                  stock: 0,
                  categoryId: "default",
                  images: "",
            },
      });

      // Update image previews when images field changes
      const watchImages = form.watch("images");

      useEffect(() => {
            if (watchImages) {
                  const urls = watchImages.split(",").map(url => url.trim()).filter(url => url !== "");
                  setImagePreviews(urls);
            } else {
                  setImagePreviews([]);
            }
      }, [watchImages]);

      const removeImage = (index: number) => {
            const currentImages = form.getValues("images") || "";
            const urls = currentImages.split(",").map(url => url.trim()).filter(url => url !== "");
            urls.splice(index, 1);
            form.setValue("images", urls.join(", "));
      };

      async function onSubmit(values: z.infer<typeof formSchema>) {
            setLoading(true);
            try {
                  // Fetch categories to get a valid categoryId
                  const categoriesResponse = await api.get("/categories");
                  const categories = categoriesResponse.data;

                  if (categories.length === 0) {
                        toast.error("No categories available. Please contact support.");
                        setLoading(false);
                        return;
                  }

                  // Use the first category
                  const categoryId = categories[0].id;

                  if (isEditing) {
                        await api.put(`/products/${initialData.id}`, { ...values, categoryId });
                        toast.success("Product updated");
                  } else {
                        await api.post("/products", { ...values, categoryId });
                        toast.success("Product created");
                  }
                  router.push("/vendor/products");
                  router.refresh();
            } catch (error: any) {
                  console.error(error);
                  toast.error(error.response?.data?.message || "Something went wrong");
            } finally {
                  setLoading(false);
            }
      }

      return (
            <Card>
                  <CardContent className="pt-6">
                        <Form {...form}>
                              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <FormField
                                          control={form.control}
                                          name="name"
                                          render={({ field }) => (
                                                <FormItem>
                                                      <FormLabel>Name</FormLabel>
                                                      <FormControl>
                                                            <Input placeholder="Product Name" {...field} />
                                                      </FormControl>
                                                      <FormMessage />
                                                </FormItem>
                                          )}
                                    />
                                    <FormField
                                          control={form.control}
                                          name="description"
                                          render={({ field }) => (
                                                <FormItem>
                                                      <FormLabel>Description</FormLabel>
                                                      <FormControl>
                                                            <Textarea placeholder="Product description..." rows={4} {...field} />
                                                      </FormControl>
                                                      <FormMessage />
                                                </FormItem>
                                          )}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                          <FormField
                                                control={form.control}
                                                name="price"
                                                render={({ field }) => (
                                                      <FormItem>
                                                            <FormLabel>Price</FormLabel>
                                                            <FormControl>
                                                                  <Input type="number" step="0.01" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                      </FormItem>
                                                )}
                                          />
                                          <FormField
                                                control={form.control}
                                                name="stock"
                                                render={({ field }) => (
                                                      <FormItem>
                                                            <FormLabel>Stock</FormLabel>
                                                            <FormControl>
                                                                  <Input type="number" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                      </FormItem>
                                                )}
                                          />
                                    </div>
                                    <FormField
                                          control={form.control}
                                          name="images"
                                          render={({ field }) => (
                                                <FormItem>
                                                      <FormLabel>Image URLs</FormLabel>
                                                      <FormControl>
                                                            <Textarea
                                                                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                                                                  rows={3}
                                                                  {...field}
                                                            />
                                                      </FormControl>
                                                      <FormDescription>
                                                            Enter one or more image URLs separated by commas
                                                      </FormDescription>
                                                      <FormMessage />

                                                      {/* Image Previews */}
                                                      {imagePreviews.length > 0 && (
                                                            <div className="mt-4">
                                                                  <p className="text-sm font-medium mb-2">Image Previews:</p>
                                                                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                                                        {imagePreviews.map((url, index) => (
                                                                              <div key={index} className="relative group">
                                                                                    <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                                                                                          <img
                                                                                                src={url}
                                                                                                alt={`Preview ${index + 1}`}
                                                                                                className="w-full h-full object-cover"
                                                                                                onError={(e) => {
                                                                                                      (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23ddd' width='100' height='100'/%3E%3Ctext fill='%23999' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle'%3EInvalid%3C/text%3E%3C/svg%3E";
                                                                                                }}
                                                                                          />
                                                                                    </div>
                                                                                    <button
                                                                                          type="button"
                                                                                          onClick={() => removeImage(index)}
                                                                                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                                    >
                                                                                          <X className="h-4 w-4" />
                                                                                    </button>
                                                                              </div>
                                                                        ))}
                                                                  </div>
                                                            </div>
                                                      )}
                                                </FormItem>
                                          )}
                                    />
                                    <Button type="submit" disabled={loading}>
                                          {loading ? "Saving..." : isEditing ? "Update Product" : "Create Product"}
                                    </Button>
                              </form>
                        </Form>
                  </CardContent>
            </Card>
      );
}
