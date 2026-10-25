import { Router } from "express";
import { processPayment } from "../controllers/payment.controller";
import { authenticate } from "../middleware/auth.middleware";

const router: Router = Router();

router.post("/", authenticate, processPayment);

export default router;
