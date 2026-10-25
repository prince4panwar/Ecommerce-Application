"use client";

import { VendorRegisterForm } from "@/features/auth/components/vendor-register-form";
import { LoginForm } from "@/features/auth/components/login-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function VendorAuthPage() {
      return (
            <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
                  <div className="w-full max-w-[400px]">
                        <div className="mb-8 text-center">
                              <h1 className="text-3xl font-bold">Vendor Portal</h1>
                              <p className="text-gray-500">Manage your business</p>
                        </div>

                        <Tabs defaultValue="login" className="w-full">
                              <TabsList className="grid w-full grid-cols-2 mb-4">
                                    <TabsTrigger value="login">Login</TabsTrigger>
                                    <TabsTrigger value="register">Register</TabsTrigger>
                              </TabsList>
                              <TabsContent value="login">
                                    {/* We reuse LoginForm. Ideally we pass a prop to hide the 'Login as Business' link here to avoid loop, 
                 but simple reuse is fine for now. */}
                                    <LoginForm isVendorLogin={true} />
                              </TabsContent>
                              <TabsContent value="register">
                                    <VendorRegisterForm />
                              </TabsContent>
                        </Tabs>
                  </div>
            </div>
      );
}
