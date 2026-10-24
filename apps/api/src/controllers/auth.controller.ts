import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Validation Schemas
const RegisterSchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
      name: z.string().optional(),
      role: z.enum(["CUSTOMER", "VENDOR"]).default("CUSTOMER"),
      // Vendor specific
      storeName: z.string().optional(),
});

const LoginSchema = z.object({
      email: z.string().email(),
      password: z.string(),
});

export const register = async (req: Request, res: Response) => {
      try {
            const validatedData = RegisterSchema.parse(req.body);
            const { email, password, name, role, storeName } = validatedData;

            const existingUser = await prisma.user.findUnique({ where: { email } });
            if (existingUser) {
                  return res.status(400).json({ message: "User already exists" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await prisma.user.create({
                  data: {
                        email,
                        password: hashedPassword,
                        name,
                        role,
                        // Create related profile based on role
                        customer: role === "CUSTOMER" ? { create: {} } : undefined,
                        vendor: role === "VENDOR" ? { create: { storeName: storeName || "My Store" } } : undefined,
                  },
                  include: {
                        customer: true,
                        vendor: true,
                  },
            });

            const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
                  expiresIn: "7d",
            });

            res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
      } catch (error) {
            if (error instanceof z.ZodError) {
                  return res.status(400).json({ errors: (error as any).errors || (error as any).issues });
            }
            console.error("Register Error:", error);
            res.status(500).json({ message: "Internal Server Error" });
      }
};

export const login = async (req: Request, res: Response) => {
      try {
            const validatedData = LoginSchema.parse(req.body);
            const { email, password } = validatedData;

            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                  return res.status(400).json({ message: "Invalid credentials" });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                  return res.status(400).json({ message: "Invalid credentials" });
            }

            const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
                  expiresIn: "7d",
            });

            res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
      } catch (error) {
            if (error instanceof z.ZodError) {
                  return res.status(400).json({ errors: (error as any).errors || (error as any).issues });
            }
            console.error("Login Error:", error);
            res.status(500).json({ message: "Internal Server Error" });
      }
};

export const forgotPassword = async (req: Request, res: Response) => {
      try {
            const { email } = z.object({ email: z.string().email() }).parse(req.body);
            // Mock email sending
            console.log(`Sending reset link to ${email}`);
            res.json({ message: "Password reset link sent to your email" });
      } catch (error) {
            res.status(400).json({ message: "Invalid email" });
      }
};

export const googleLogin = async (req: Request, res: Response) => {
      // Mock Google Login
      const { role } = req.body;
      const userRole = role === "VENDOR" ? "VENDOR" : "CUSTOMER";
      const mockUser = { id: "mock-google-id", email: "google-user@example.com", name: "Google User", role: userRole };
      const token = jwt.sign({ userId: mockUser.id, role: mockUser.role }, JWT_SECRET, {
            expiresIn: "7d",
      });

      res.json({
            message: "Google Login successful (Mocked)",
            token,
            user: mockUser
      });
};

export const sendOTP = async (req: Request, res: Response) => {
      try {
            const { phone } = z.object({ phone: z.string().length(10) }).parse(req.body);
            // Mock OTP sending
            console.log(`Sending OTP to ${phone}`);
            res.json({ message: "OTP sent successfully" });
      } catch (error) {
            res.status(400).json({ message: "Invalid phone number" });
      }
};

export const verifyOTP = async (req: Request, res: Response) => {
      try {
            const { phone, otp, role } = z.object({ phone: z.string().length(10), otp: z.string().length(6), role: z.string().optional() }).parse(req.body);
            const userRole = role === "VENDOR" ? "VENDOR" : "CUSTOMER";
            const mockUser = { id: "mock-otp-id", email: `${phone}@mobile.com`, name: `User ${phone}`, role: userRole };
            const token = jwt.sign({ userId: mockUser.id, role: mockUser.role }, JWT_SECRET, {
                  expiresIn: "7d",
            });

            res.json({
                  message: "OTP verified successfully",
                  token,
                  user: mockUser
            });
      } catch (error) {
            res.status(400).json({ message: "Invalid request" });
      }
};
