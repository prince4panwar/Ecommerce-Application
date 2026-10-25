"use client";

import { LoginForm } from "@/features/auth/components/login-form";
import { RegisterForm } from "@/features/auth/components/register-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function AuthPage() {
      const [isLogin, setIsLogin] = useState(true);

      return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
                  <div className="mb-4">
                        <h1 className="text-3xl font-bold text-center mb-2">My E-Commerce</h1>
                        <p className="text-gray-500 text-center">Welcome back</p>
                  </div>

                  <div className="w-full max-w-sm">
                        {isLogin ? <LoginForm /> : <RegisterForm />}
                  </div>

                  <div className="mt-4 text-center">
                        <p className="text-sm text-gray-500">
                              {isLogin ? "Don't have an account?" : "Already have an account?"}
                              <Button variant="link" onClick={() => setIsLogin(!isLogin)} className="ml-1">
                                    {isLogin ? "Register" : "Login"}
                              </Button>
                        </p>
                  </div>
            </div>
      );
}
