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
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
      email: z.string().email(),
      password: z.string().min(1, "Password is required"),
});

interface LoginFormProps {
      isVendorLogin?: boolean;
}

export function LoginForm({ isVendorLogin = false }: LoginFormProps) {
      const router = useRouter();
      const [loading, setLoading] = useState(false);
      const [showOtpInput, setShowOtpInput] = useState(false);
      const [mobileNumber, setMobileNumber] = useState("");
      const [isMounted, setIsMounted] = useState(false);

      useEffect(() => {
            setIsMounted(true);
      }, []);

      const form = useForm<z.infer<typeof formSchema>>({
            resolver: zodResolver(formSchema),
            defaultValues: {
                  email: "",
                  password: "",
            },
      });

      async function onSubmit(values: z.infer<typeof formSchema>) {
            setLoading(true);
            try {
                  const response = await api.post("/auth/login", values);
                  const { token, user } = response.data;
                  setToken(token);
                  localStorage.setItem("user", JSON.stringify(user));
                  toast.success("Logged in successfully");

                  // Use window.location.href for proper redirect with page reload
                  if (user.role === "VENDOR") {
                        window.location.href = "/vendor";
                  } else {
                        window.location.href = "/products";
                  }
            } catch (error: any) {
                  console.error(error);
                  toast.error(error.response?.data?.message || "Login failed");
            } finally {
                  setLoading(false);
            }
      }

      return (
            <Card className="w-full shadow-lg border-t-4 border-t-primary">
                  <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold">{isVendorLogin ? "Vendor Portal" : "Welcome Back"}</CardTitle>
                        <CardDescription>
                              {isVendorLogin
                                    ? "Manage your business and grow your sales."
                                    : "Enter your credentials to access your account."}
                        </CardDescription>
                  </CardHeader>
                  <CardContent>
                        {isMounted && (
                              <Tabs defaultValue="email" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2 mb-6">
                                          <TabsTrigger value="email">Email Login</TabsTrigger>
                                          <TabsTrigger value="mobile">Mobile Login</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="email">
                                          <Form {...form}>
                                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                                      <FormField
                                                            control={form.control}
                                                            name="email"
                                                            render={({ field }) => (
                                                                  <FormItem>
                                                                        <FormLabel>Email</FormLabel>
                                                                        <FormControl>
                                                                              <Input placeholder="email@example.com" {...field} />
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
                                                                        <div className="flex items-center justify-between">
                                                                              <FormLabel>Password</FormLabel>
                                                                              <Button
                                                                                    variant="link"
                                                                                    className="px-0 font-normal text-xs"
                                                                                    type="button"
                                                                                    onClick={() => toast.info("Forgot password flow coming soon!")}
                                                                              >
                                                                                    Forgot Password?
                                                                              </Button>
                                                                        </div>
                                                                        <FormControl>
                                                                              <Input type="password" placeholder="******" {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                  </FormItem>
                                                            )}
                                                      />
                                                      <Button type="submit" className="w-full py-6 text-lg font-semibold" disabled={loading}>
                                                            {loading ? "Logging in..." : "Login"}
                                                      </Button>
                                                </form>
                                          </Form>
                                    </TabsContent>

                                    <TabsContent value="mobile">
                                          <div className="space-y-4">
                                                {!showOtpInput ? (
                                                      <>
                                                            <div className="space-y-2">
                                                                  <Label>Mobile Number</Label>
                                                                  <div className="flex gap-2">
                                                                        <div className="flex items-center justify-center px-3 border rounded-md bg-muted text-sm font-medium">
                                                                              +91
                                                                        </div>
                                                                        <Input
                                                                              placeholder="Enter 10 digit number"
                                                                              value={mobileNumber}
                                                                              onChange={(e) => setMobileNumber(e.target.value)}
                                                                              maxLength={10}
                                                                        />
                                                                  </div>
                                                            </div>
                                                            <Button
                                                                  className="w-full py-6 text-lg font-semibold"
                                                                  onClick={() => {
                                                                        if (mobileNumber.length === 10) {
                                                                              setShowOtpInput(true);
                                                                              toast.success("OTP sent to your mobile number");
                                                                        } else {
                                                                              toast.error("Please enter a valid 10-digit mobile number");
                                                                        }
                                                                  }}
                                                            >
                                                                  Send OTP
                                                            </Button>
                                                      </>
                                                ) : (
                                                      <>
                                                            <div className="space-y-2">
                                                                  <Label>Verify OTP</Label>
                                                                  <Input
                                                                        placeholder="Enter 6-digit OTP"
                                                                        className="text-center tracking-[1em] text-2xl h-12"
                                                                        maxLength={6}
                                                                  />
                                                                  <p className="text-xs text-muted-foreground text-center">
                                                                        We've sent a code to +91 {mobileNumber}
                                                                  </p>
                                                            </div>
                                                            <Button
                                                                  className="w-full py-6 text-lg font-semibold"
                                                                  onClick={async () => {
                                                                        try {
                                                                              const otpInput = (document.querySelector('input[placeholder="Enter 6-digit OTP"]') as HTMLInputElement);
                                                                              const otp = otpInput?.value;
                                                                              if (otp?.length === 6) {
                                                                                    const res = await api.post("/auth/verify-otp", { phone: mobileNumber, otp, role: isVendorLogin ? "VENDOR" : "CUSTOMER" });
                                                                                    setToken(res.data.token);
                                                                                    localStorage.setItem("user", JSON.stringify(res.data.user));
                                                                                    toast.success("Login successful");
                                                                                    if (res.data.user.role === "VENDOR") {
                                                                                          router.push("/vendor");
                                                                                    } else {
                                                                                          router.push("/products");
                                                                                    }
                                                                              } else {
                                                                                    toast.error("Please enter a 6-digit OTP");
                                                                              }
                                                                        } catch (error) {
                                                                              toast.error("Failed to verify OTP");
                                                                        }
                                                                  }}
                                                            >
                                                                  Verify & Login
                                                            </Button>
                                                            <Button
                                                                  variant="ghost"
                                                                  className="w-full"
                                                                  onClick={() => setShowOtpInput(false)}
                                                            >
                                                                  Change Number
                                                            </Button>
                                                      </>
                                                )}
                                          </div>
                                    </TabsContent>
                              </Tabs>
                        )}

                        <div className="relative my-8">
                              <div className="absolute inset-0 flex items-center">
                                    <Separator className="w-full" />
                              </div>
                              <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground italic">Or continue with</span>
                              </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                              <Button
                                    variant="outline"
                                    className="w-full py-6 flex items-center justify-center gap-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-900 border-2"
                                    onClick={async () => {
                                          const loadingToast = toast.loading("Connecting to Google...");
                                          try {
                                                const res = await api.post("/auth/google-login", { role: isVendorLogin ? "VENDOR" : "CUSTOMER" });
                                                setToken(res.data.token);
                                                localStorage.setItem("user", JSON.stringify(res.data.user));
                                                toast.dismiss(loadingToast);
                                                toast.success("Login successful");
                                                if (res.data.user.role === "VENDOR") {
                                                      router.push("/vendor");
                                                } else {
                                                      router.push("/products");
                                                }
                                          } catch (error) {
                                                toast.dismiss(loadingToast);
                                                toast.error("Google Login failed");
                                          }
                                    }}
                              >
                                    <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    Sign in with Google
                              </Button>
                        </div>

                        {!isVendorLogin && (
                              <div className="mt-8 text-center text-sm">
                                    <p className="text-muted-foreground">
                                          Looking to expand your reach?{" "}
                                          <span
                                                className="text-primary cursor-pointer hover:underline font-bold transition-all"
                                                onClick={() => router.push("/vendor/auth")}
                                          >
                                                Start Selling
                                          </span>
                                    </p>
                              </div>
                        )}
                  </CardContent>
            </Card>
      );
}
