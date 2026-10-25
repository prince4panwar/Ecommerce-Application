import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

const OrderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
});

const CreateOrderSchema = z.object({
  items: z.array(OrderItemSchema),
});

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const customer = await prisma.customer.findUnique({ where: { userId } });
    if (!customer)
      return res.status(400).json({ message: "User is not a customer" });

    const { items } = CreateOrderSchema.parse(req.body);

    // Calculate total and Verify stock
    let total = 0;
    const orderItemsData: {
      productId: string;
      quantity: number;
      price: number;
    }[] = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });
      if (!product)
        return res
          .status(400)
          .json({ message: `Product ${item.productId} not found` });
      if (product.stock < item.quantity)
        return res
          .status(400)
          .json({ message: `Insufficient stock for ${product.name}` });

      total += product.price * item.quantity;
      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Transaction
    const order = await prisma.$transaction(async (tx) => {
      // 1. Create Order
      const newOrder = await tx.order.create({
        data: {
          customerId: customer.id,
          total,
          status: "PENDING",
          items: {
            create: orderItemsData,
          },
        },
        include: { items: true },
      });

      // 2. Update Stock
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return newOrder;
    });

    res.status(201).json(order);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ errors: (error as any).errors || (error as any).issues });
    }
    console.error("Create Order Error:", error);
    res.status(500).json({ message: "Error creating order" });
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const customer = await prisma.customer.findUnique({ where: { userId } });
    if (!customer)
      return res.status(400).json({ message: "User is not a customer" });

    const orders = await prisma.order.findMany({
      where: { customerId: customer.id },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
};

export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
        shipment: true,
        payment: true,
      },
    });
    // Check permission (Customer owns it or Vendor supplies it or Admin)
    // Simplified: Allow if logged in for now, ideally check ownership
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Error fetching order" });
  }
};

export const getVendorOrders = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== "VENDOR")
      return res.status(403).json({ message: "Forbidden" });
    const userId = req.user.userId;
    const vendor = await prisma.vendor.findUnique({ where: { userId } });
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    const orders = await prisma.order.findMany({
      where: {
        items: {
          some: {
            product: {
              vendorId: vendor.id,
            },
          },
        },
      },
      include: {
        items: {
          where: {
            product: {
              vendorId: vendor.id,
            },
          },
          include: { product: true },
        },
        customer: {
          include: { user: { select: { name: true, email: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching vendor orders" });
  }
};
