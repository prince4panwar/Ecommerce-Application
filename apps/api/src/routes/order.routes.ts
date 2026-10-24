import { Router } from "express";
import { createOrder, getMyOrders, getOrderById, getVendorOrders } from "../controllers/order.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authenticate, createOrder);
router.get("/", authenticate, getMyOrders);
router.get("/vendor", authenticate, getVendorOrders);
router.get("/:id", authenticate, getOrderById);

export default router;
