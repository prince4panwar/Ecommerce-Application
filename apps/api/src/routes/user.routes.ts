import { Router } from "express";
import {
  getProfile,
  updateProfile,
  addAddress,
  deleteProfile,
  updateAddress,
  deleteAddress,
} from "../controllers/user.controller";
import { authenticate } from "../middleware/auth.middleware";

const router: Router = Router();

router.get("/profile", authenticate, getProfile);
router.put("/profile", authenticate, updateProfile);
router.delete("/profile", authenticate, deleteProfile);
router.post("/address", authenticate, addAddress);
router.put("/address/:id", authenticate, updateAddress);
router.delete("/address/:id", authenticate, deleteAddress);

export default router;
