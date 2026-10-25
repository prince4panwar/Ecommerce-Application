"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { LayoutDashboard, Package, ShoppingCart, BarChart } from "lucide-react";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
      items: {
            href: string;
            title: string;
            icon: React.ComponentType<{ className?: string }>;
      }[];
}

export function VendorSidebar({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
      const pathname = usePathname();
      const items = [
            {
                  href: "/vendor",
                  title: "Dashboard",
                  icon: LayoutDashboard,
            },
            {
                  href: "/vendor/products",
                  title: "Products",
                  icon: Package,
            },
            {
                  href: "/vendor/orders",
                  title: "Orders",
                  icon: ShoppingCart,
            },
            // {
            //   href: "/vendor/analytics",
            //   title: "Analytics",
            //   icon: BarChart,
            // },
      ];

      return (
            <nav
                  className={cn(
                        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
                        className
                  )}
                  {...props}
            >
                  {items.map((item) => (
                        <Link
                              key={item.href}
                              href={item.href}
                              className={cn(
                                    buttonVariants({ variant: "ghost" }),
                                    pathname === item.href
                                          ? "bg-muted hover:bg-muted"
                                          : "hover:bg-transparent hover:underline",
                                    "justify-start"
                              )}
                        >
                              <item.icon className="mr-2 h-4 w-4" />
                              {item.title}
                        </Link>
                  ))}
            </nav>
      );
}
