"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
      Form,
      FormControl,
      FormField,
      FormItem,
      FormLabel,
      FormMessage,
} from "@/components/ui/form";
import { api, setToken } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useState } from "react";

const formSchema = z.object({
      name: z.string().min(2, "Name is required"),
      email: z.string().email("Invalid email"),
      password: z.string().min(6, "Password must be at least 6 characters"),
      storeName: z.string().min(2, "Store Name is required"),
});

export function VendorRegisterForm() {
      const router = useRouter();
      const [loading, setLoading] = useState(false);

      const form = useForm<z.infer<typeof formSchema>>({
            resolver: zodResolver(formSchema),
            defaultValues: {
                  name: "",
                  email: "",
                  password: "",
                  storeName: "",
            },
      });

      async function onSubmit(values: z.infer<typeof formSchema>) {
            setLoading(true);
            try {
                  // Force role to VENDOR
                  const payload = { ...values, role: "VENDOR" };
                  const response = await api.post("/auth/register", payload);
                  const { token, user } = response.data;
                  setToken(token);
                  localStorage.setItem("user", JSON.stringify(user));
                  toast.success("Vendor account created successfully");
                  window.location.href = "/vendor";
            } catch (error: any) {
                  console.error(error);
                  toast.error(error.response?.data?.message || "Registration failed");
            } finally {
                  setLoading(false);
            }
      }

      return (
            <Card className="w-[400px]">
                  <CardHeader>
                        <CardTitle>Become a Seller</CardTitle>
                        <CardDescription>Create your business account to start selling.</CardDescription>
                  </CardHeader>
                  <CardContent>
                        <Form {...form}>
                              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <FormField
                                          control={form.control}
                                          name="name"
                                          render={({ field }) => (
                                                <FormItem>
                                                      <FormLabel>Full Name</FormLabel>
                                                      <FormControl>
                                                            <Input placeholder="John Doe" {...field} />
                                                      </FormControl>
                                                      <FormMessage />
                                                </FormItem>
                                          )}
                                    />
                                    <FormField
                                          control={form.control}
                                          name="storeName"
                                          render={({ field }) => (
                                                <FormItem>
                                                      <FormLabel>Store Name</FormLabel>
                                                      <FormControl>
                                                            <Input placeholder="My Awesome Store" {...field} />
                                                      </FormControl>
                                                      <FormMessage />
                                                </FormItem>
                                          )}
                                    />
                                    <FormField
                                          control={form.control}
                                          name="email"
                                          render={({ field }) => (
                                                <FormItem>
                                                      <FormLabel>Business Email</FormLabel>
                                                      <FormControl>
                                                            <Input placeholder="store@example.com" {...field} />
                                                      </FormControl>
                                                      <FormMessage />
                                                </FormItem>
                                          )}
                                    />
                                    <FormField
                                          control={form.control}
                                          name="password"
                                          render={({ field }) => (
                                                <FormItem>
                                                      <FormLabel>Password</FormLabel>
                                                      <FormControl>
                                                            <Input type="password" placeholder="******" {...field} />
                                                      </FormControl>
                                                      <FormMessage />
                                                </FormItem>
                                          )}
                                    />
                                    <Button type="submit" className="w-full" disabled={loading}>
                                          {loading ? "Creating Account..." : "Register as Vendor"}
                                    </Button>
                              </form>
                        </Form>
                  </CardContent>
            </Card>
      );
}
