"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingCart, User, Package, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
// import { useAuth } from "@/hooks/use-auth"; // If we had one, or just check localStorage
import { useEffect, useState } from "react";
import { setToken } from "@/lib/api";

export function Header() {
      const pathname = usePathname();
      const router = useRouter();
      const { items } = useCart();
      const [mounted, setMounted] = useState(false);
      const [user, setUser] = useState<any>(null);

      useEffect(() => {
            setMounted(true);
            const userStr = localStorage.getItem("user");
            if (userStr) {
                  setUser(JSON.parse(userStr));
            }
      }, []);

      // Hide header on Vendor pages and Auth pages
      if (pathname.startsWith("/vendor") || pathname === "/login" || pathname === "/register") {
            return null;
      }

      const handleLogout = () => {
            setToken("");
            localStorage.removeItem("user");
            window.location.href = "/login";
      };

      if (!mounted) return null;

      return (
            <header className="border-b bg-white dark:bg-gray-950 sticky top-0 z-50">
                  <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                              E-Commerce
                        </Link>

                        <nav className="hidden md:flex items-center gap-6">
                              <Link href="/products" className={`text-sm font-medium hover:text-primary ${pathname === "/products" ? "text-primary" : "text-muted-foreground"}`}>
                                    Products
                              </Link>
                              {/* Add more links if needed */}
                        </nav>

                        <div className="flex items-center gap-4">
                              {user ? (
                                    <>
                                          <Link href="/orders">
                                                <Button variant="ghost" size="icon" title="My Orders">
                                                      <Package className="h-5 w-5" />
                                                </Button>
                                          </Link>
                                          <Link href="/cart">
                                                <Button variant="ghost" size="icon" className="relative" title="Cart">
                                                      <ShoppingCart className="h-5 w-5" />
                                                      {items.length > 0 && (
                                                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                                                                  {items.length}
                                                            </span>
                                                      )}
                                                </Button>
                                          </Link>
                                          <Link href="/profile">
                                                <Button variant="ghost" size="icon" title="Profile">
                                                      <User className="h-5 w-5" />
                                                </Button>
                                          </Link>
                                          <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                                                <LogOut className="h-5 w-5" />
                                          </Button>
                                    </>
                              ) : (
                                    <Button onClick={() => router.push("/login")}>Login</Button>
                              )}
                        </div>
                  </div>
            </header>
      );
}
