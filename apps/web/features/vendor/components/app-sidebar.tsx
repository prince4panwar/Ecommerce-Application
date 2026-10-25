"use client"

import { Home, Package, ShoppingCart, LogOut, Store, Plus } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import {
      Sidebar,
      SidebarContent,
      SidebarGroup,
      SidebarGroupContent,
      SidebarGroupLabel,
      SidebarMenu,
      SidebarMenuButton,
      SidebarMenuItem,
      SidebarFooter,
} from "@/components/ui/sidebar"

const menuItems = [
      {
            title: "Dashboard",
            url: "/vendor",
            icon: Home,
      },
      {
            title: "Products",
            url: "/vendor/products",
            icon: Package,
      },
      {
            title: "Bulk Add",
            url: "/vendor/products/bulk",
            icon: Plus,
      },
      {
            title: "Orders",
            url: "/vendor/orders",
            icon: ShoppingCart,
      },
]

export function AppSidebar() {
      const pathname = usePathname()
      const router = useRouter()

      const handleLogout = () => {
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            router.push("/login")
      }

      return (
            <Sidebar>
                  <SidebarContent>
                        <SidebarGroup>
                              <SidebarGroupLabel className="flex items-center gap-2 text-lg font-bold">
                                    <Store className="h-5 w-5" />
                                    Vendor Portal
                              </SidebarGroupLabel>
                              <SidebarGroupContent>
                                    <SidebarMenu>
                                          {menuItems.map((item) => (
                                                <SidebarMenuItem key={item.title}>
                                                      <SidebarMenuButton asChild isActive={pathname === item.url}>
                                                            <Link href={item.url}>
                                                                  <item.icon />
                                                                  <span>{item.title}</span>
                                                            </Link>
                                                      </SidebarMenuButton>
                                                </SidebarMenuItem>
                                          ))}
                                    </SidebarMenu>
                              </SidebarGroupContent>
                        </SidebarGroup>
                  </SidebarContent>
                  <SidebarFooter>
                        <SidebarMenu>
                              <SidebarMenuItem>
                                    <SidebarMenuButton onClick={handleLogout}>
                                          <LogOut />
                                          <span>Logout</span>
                                    </SidebarMenuButton>
                              </SidebarMenuItem>
                        </SidebarMenu>
                  </SidebarFooter>
            </Sidebar>
      )
}
