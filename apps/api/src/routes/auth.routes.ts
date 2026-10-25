import { Router } from "express";
import {
  register,
  login,
  forgotPassword,
  googleLogin,
  sendOTP,
  verifyOTP,
} from "../controllers/auth.controller";

const router: Router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/google-login", googleLogin);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

export default router;
