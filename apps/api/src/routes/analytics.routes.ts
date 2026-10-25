import { Router } from "express";
import { getVendorAnalytics } from "../controllers/analytics.controller";
import { authenticate } from "../middleware/auth.middleware";

const router: Router = Router();

router.get("/vendor", authenticate, getVendorAnalytics);

export default router;
