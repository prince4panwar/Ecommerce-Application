import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

export const processPayment = async (req: AuthRequest, res: Response) => {
      try {
            const { orderId, method, amount } = req.body;

            // In a real app, integrate Stripe/PayPal here

            const payment = await prisma.payment.create({
                  data: {
                        orderId,
                        amount,
                        method: method || "CREDIT_CARD",
                        status: "COMPLETED", // Mock success
                  },
            });

            await prisma.order.update({
                  where: { id: orderId },
                  data: { status: "PROCESSING" },
            });

            res.status(201).json({ message: "Payment successful", payment });
      } catch (error) {
            res.status(500).json({ message: "Error processing payment" });
      }
};
