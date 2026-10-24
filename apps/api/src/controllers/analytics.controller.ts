import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

export const getVendorAnalytics = async (req: AuthRequest, res: Response) => {
      try {
            if (req.user?.role !== "VENDOR") return res.status(403).json({ message: "Forbidden" });

            const userId = req.user.userId;
            const vendor = await prisma.vendor.findUnique({ where: { userId } });
            if (!vendor) return res.status(404).json({ message: "Vendor not found" });

            // Mock Analytics: Total Sales, Total Products
            const products = await prisma.product.findMany({ where: { vendorId: vendor.id } });
            const productIds = products.map(p => p.id);

            // Find order items for these products (Naive, assuming simple linkage)
            const orderItems = await prisma.orderItem.findMany({
                  where: { productId: { in: productIds } },
            });

            const totalRevenue = orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
            const totalSalesCount = orderItems.length;

            res.json({
                  totalProducts: products.length,
                  totalRevenue,
                  totalSalesCount,
                  recentSales: orderItems.slice(0, 5),
            });
      } catch (error) {
            res.status(500).json({ message: "Error fetching analytics" });
      }
};
