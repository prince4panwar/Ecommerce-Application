"use client";

import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
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
import {
      Select,
      SelectContent,
      SelectItem,
      SelectTrigger,
      SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Loader2 } from "lucide-react";

// Custom validation for comma-separated URLs
const validateImageUrls = (value: string | undefined) => {
      if (!value || value.trim() === "") return true;

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

const productSchema = z.object({
      name: z.string().min(2, "Name is required"),
      description: z.string().min(10, "Description must be at least 10 characters"),
      price: z.coerce.number().positive("Price must be positive"),
      stock: z.coerce.number().int().nonnegative("Stock cannot be negative"),
      categoryId: z.string().min(1, "Category is required"),
      images: z.string()
            .optional()
            .refine(validateImageUrls, {
                  message: "All URLs must be valid. Separate multiple URLs with commas.",
            }),
});

const formSchema = z.object({
      products: z.array(productSchema).min(1, "At least one product is required").max(10, "Maximum 10 products at once"),
});

type FormValues = z.infer<typeof formSchema>;

export function BulkProductForm() {
      const router = useRouter();
      const [loading, setLoading] = useState(false);
      const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
      const [fetchingCategories, setFetchingCategories] = useState(true);
      const [step, setStep] = useState<"edit" | "preview">("edit");

      useEffect(() => {
            const fetchCategories = async () => {
                  try {
                        const response = await api.get("/categories");
                        setCategories(response.data);
                  } catch (error) {
                        toast.error("Failed to load categories");
                  } finally {
                        setFetchingCategories(false);
                  }
            };
            fetchCategories();
      }, []);

      const form = useForm<FormValues>({
            resolver: zodResolver(formSchema),
            defaultValues: {
                  products: [
                        {
                              name: "",
                              description: "",
                              price: 0,
                              stock: 0,
                              categoryId: "",
                              images: "",
                        },
                  ],
            },
      });

      const { fields, append, remove } = useFieldArray({
            control: form.control,
            name: "products",
      });

      const onSubmit: SubmitHandler<FormValues> = async (values) => {
            // First validation passed, move to preview
            setStep("preview");
      };

      const confirmSubmit = async () => {
            const values = form.getValues();
            setLoading(true);
            try {
                  const response = await api.post("/products/bulk", values.products);
                  toast.success(response.data.message || "Products created successfully");
                  router.push("/vendor/products");
                  router.refresh();
            } catch (error: any) {
                  console.error(error);
                  if (error.response?.data?.errors) {
                        const errorMessages = error.response.data.errors.map((err: any) =>
                              `Product ${err.index + 1}: ${err.errors.map((e: any) => e.message).join(", ")}`
                        ).join("\n");
                        toast.error(`Validation errors:\n${errorMessages}`);
                        setStep("edit"); // Go back to fix errors
                  } else {
                        toast.error(error.response?.data?.message || "Something went wrong");
                  }
            } finally {
                  setLoading(false);
            }
      };

      if (fetchingCategories) {
            return (
                  <div className="flex items-center justify-center p-12">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                        <span className="ml-2 text-gray-500">Loading categories...</span>
                  </div>
            );
      }

      const products = form.getValues().products;

      if (step === "preview") {
            return (
                  <div className="space-y-6">
                        <div className="flex justify-between items-center">
                              <div>
                                    <h2 className="text-3xl font-bold tracking-tight">Review Products</h2>
                                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                                          Please review your bulk entries before final creation
                                    </p>
                              </div>
                              <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setStep("edit")}
                              >
                                    Back to Edit
                              </Button>
                        </div>

                        <div className="grid gap-4">
                              {products.map((product, index) => (
                                    <Card key={index}>
                                          <CardHeader className="py-3 bg-muted/30">
                                                <CardTitle className="text-md flex justify-between">
                                                      <span>#{index + 1}: {product.name}</span>
                                                      <span className="text-primary">${product.price.toFixed(2)}</span>
                                                </CardTitle>
                                          </CardHeader>
                                          <CardContent className="py-4 text-sm space-y-2">
                                                <div className="grid grid-cols-2 gap-4">
                                                      <div>
                                                            <p className="font-semibold text-xs uppercase text-gray-500">Category</p>
                                                            <p>{categories.find(c => c.id === product.categoryId)?.name || "N/A"}</p>
                                                      </div>
                                                      <div>
                                                            <p className="font-semibold text-xs uppercase text-gray-500">Stock</p>
                                                            <p>{product.stock} units</p>
                                                      </div>
                                                </div>
                                                <div>
                                                      <p className="font-semibold text-xs uppercase text-gray-500">Description</p>
                                                      <p className="line-clamp-2">{product.description}</p>
                                                </div>
                                          </CardContent>
                                    </Card>
                              ))}
                        </div>

                        <div className="flex gap-4 pt-4">
                              <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setStep("edit")}
                                    className="flex-1"
                              >
                                    Edit List
                              </Button>
                              <Button
                                    onClick={confirmSubmit}
                                    disabled={loading}
                                    className="flex-1"
                              >
                                    {loading ? (
                                          <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Creating...
                                          </>
                                    ) : (
                                          `Confirm & Create ${products.length} Products`
                                    )}
                              </Button>
                        </div>
                  </div>
            );
      }

      return (
            <div className="space-y-4">
                  <div className="flex justify-between items-center">
                        <div>
                              <h2 className="text-3xl font-bold tracking-tight">Bulk Add Products</h2>
                              <p className="text-gray-500 dark:text-gray-400 mt-1">
                                    Add multiple products quickly (limit: 10)
                              </p>
                        </div>
                        <Button
                              type="button"
                              variant="outline"
                              onClick={() => router.back()}
                        >
                              Cancel
                        </Button>
                  </div>

                  <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6">
                              {fields.map((field, index) => (
                                    <Card key={field.id} className="relative overflow-hidden">
                                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-muted/30">
                                                <CardTitle className="text-lg">Product {index + 1}</CardTitle>
                                                {fields.length > 1 && (
                                                      <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => remove(index)}
                                                            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                                                      >
                                                            <Trash2 className="h-4 w-4" />
                                                      </Button>
                                                )}
                                          </CardHeader>
                                          <CardContent className="space-y-4 pt-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                      <FormField
                                                            control={form.control}
                                                            name={`products.${index}.name`}
                                                            render={({ field }) => (
                                                                  <FormItem>
                                                                        <FormLabel>Name</FormLabel>
                                                                        <FormControl>
                                                                              <Input placeholder="e.g., Wireless Headphones" {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                  </FormItem>
                                                            )}
                                                      />
                                                      <FormField
                                                            control={form.control}
                                                            name={`products.${index}.categoryId`}
                                                            render={({ field }) => (
                                                                  <FormItem>
                                                                        <FormLabel>Category</FormLabel>
                                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                                              <FormControl>
                                                                                    <SelectTrigger>
                                                                                          <SelectValue placeholder="Select a category" />
                                                                                    </SelectTrigger>
                                                                              </FormControl>
                                                                              <SelectContent>
                                                                                    {categories.map((category) => (
                                                                                          <SelectItem key={category.id} value={category.id}>
                                                                                                {category.name}
                                                                                          </SelectItem>
                                                                                    ))}
                                                                              </SelectContent>
                                                                        </Select>
                                                                        <FormMessage />
                                                                  </FormItem>
                                                            )}
                                                      />
                                                </div>

                                                <FormField
                                                      control={form.control}
                                                      name={`products.${index}.description`}
                                                      render={({ field }) => (
                                                            <FormItem>
                                                                  <FormLabel>Description</FormLabel>
                                                                  <FormControl>
                                                                        <Textarea placeholder="Describe your product..." rows={2} {...field} />
                                                                  </FormControl>
                                                                  <FormMessage />
                                                            </FormItem>
                                                      )}
                                                />

                                                <div className="grid grid-cols-2 gap-4">
                                                      <FormField
                                                            control={form.control}
                                                            name={`products.${index}.price`}
                                                            render={({ field }) => (
                                                                  <FormItem>
                                                                        <FormLabel>Price ($)</FormLabel>
                                                                        <FormControl>
                                                                              <Input type="number" step="0.01" placeholder="0.00" {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                  </FormItem>
                                                            )}
                                                      />
                                                      <FormField
                                                            control={form.control}
                                                            name={`products.${index}.stock`}
                                                            render={({ field }) => (
                                                                  <FormItem>
                                                                        <FormLabel>Stock Count</FormLabel>
                                                                        <FormControl>
                                                                              <Input type="number" placeholder="0" {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                  </FormItem>
                                                            )}
                                                      />
                                                </div>

                                                <FormField
                                                      control={form.control}
                                                      name={`products.${index}.images`}
                                                      render={({ field }) => (
                                                            <FormItem>
                                                                  <FormLabel>Image URLs</FormLabel>
                                                                  <FormControl>
                                                                        <Input
                                                                              placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                                                                              {...field}
                                                                        />
                                                                  </FormControl>
                                                                  <FormDescription>
                                                                        Separate multiple URLs with commas
                                                                  </FormDescription>
                                                                  <FormMessage />
                                                            </FormItem>
                                                      )}
                                                />
                                          </CardContent>
                                    </Card>
                              ))}

                              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                    <Button
                                          type="button"
                                          variant="outline"
                                          onClick={() => append({
                                                name: "",
                                                description: "",
                                                price: 0,
                                                stock: 0,
                                                categoryId: fields[fields.length - 1]?.categoryId || "",
                                                images: "",
                                          })}
                                          className="flex-1"
                                          disabled={fields.length >= 10}
                                    >
                                          <Plus className="mr-2 h-4 w-4" />
                                          Add Another Product
                                    </Button>
                                    <Button type="submit" className="flex-1">
                                          Continue to Preview ({fields.length} Product{fields.length > 1 ? "s" : ""})
                                    </Button>
                              </div>
                        </form>
                  </Form>
            </div>
      );
}
