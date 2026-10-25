"use client";

import Link from "next/link";
import { User, Store, ArrowRight, ShoppingBag, Briefcase } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen relative flex flex-col items-center justify-center p-6 md:p-24 overflow-hidden bg-white dark:bg-slate-950">
      {/* Background Orbs for Premium Look */}
      <div className="absolute top-0 -left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 -right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-700" />

      <div className="z-10 text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
          My E-Commerce
        </h1>
        <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Simplifying the way you shop and sell. Choose how you want to get started today.
        </p>
      </div>

      <div className="z-10 grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        {/* Customer Section */}
        <Link href="/login" className="group">
          <Card className="h-full relative overflow-hidden border-2 border-transparent transition-all duration-300 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
            <CardHeader className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
                <ShoppingBag size={32} />
              </div>
              <CardTitle className="text-2xl font-bold">I want to Shop</CardTitle>
              <CardDescription className="text-base">
                Discover millions of products, track orders, and join our loyalty program.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-2 group/btn">
                Customer Login
                <ArrowRight size={18} className="translate-x-0 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
            {/* Visual Flair */}
            <div className="absolute top-2 right-2 opacity-10 group-hover:opacity-20 transition-opacity">
              <User size={80} />
            </div>
          </Card>
        </Link>

        {/* Vendor Section */}
        <Link href="/vendor/auth" className="group">
          <Card className="h-full relative overflow-hidden border-2 border-transparent transition-all duration-300 hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-500/10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
            <CardHeader className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300">
                <Store size={32} />
              </div>
              <CardTitle className="text-2xl font-bold">I want to Sell</CardTitle>
              <CardDescription className="text-base">
                Access your vendor dashboard, manage inventory, and grow your business.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-semibold flex items-center justify-center gap-2 group/btn">
                Vendor Portal
                <ArrowRight size={18} className="translate-x-0 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
            {/* Visual Flair */}
            <div className="absolute top-2 right-2 opacity-10 group-hover:opacity-20 transition-opacity">
              <Briefcase size={80} />
            </div>
          </Card>
        </Link>
      </div>

      {/* Footer Info */}
      <div className="z-10 mt-16 text-slate-400 dark:text-slate-500 text-sm">
        Premium E-Commerce Solution &bull; Secure & Reliable
      </div>
    </main>
  );
}
