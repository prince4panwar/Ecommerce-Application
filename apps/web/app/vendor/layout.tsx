"use client";

import { useEffect, useState } from "react";
import { getToken } from "@/lib/api";
import { useRouter } from "next/navigation";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/features/vendor/components/app-sidebar";
import { Separator } from "@/components/ui/separator";

export default function VendorLayout({ children }: { children: React.ReactNode }) {
      const router = useRouter();
      const [isAuthPage, setIsAuthPage] = useState(false);

      useEffect(() => {
            // Check if we're on the auth page
            const pathname = window.location.pathname;
            const authPage = pathname === "/vendor/auth";
            setIsAuthPage(authPage);

            // Skip protection for auth page
            if (authPage) {
                  return;
            }

            const token = getToken();
            if (!token) {
                  router.push("/vendor/auth");
                  return;
            }
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            if (user.role !== "VENDOR") {
                  router.push("/");
            }
      }, [router]);

      // If on auth page, just render children without vendor layout
      if (isAuthPage) {
            return <>{children}</>;
      }

      return (
            <SidebarProvider>
                  <AppSidebar />
                  <SidebarInset>
                        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                              <SidebarTrigger className="-ml-1" />
                              <Separator orientation="vertical" className="mr-2 h-4" />
                              <h1 className="text-lg font-semibold">Vendor Dashboard</h1>
                        </header>
                        <div className="flex flex-1 flex-col gap-4 p-4">
                              {children}
                        </div>
                  </SidebarInset>
            </SidebarProvider>
      );
}
