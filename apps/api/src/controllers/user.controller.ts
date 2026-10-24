import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

// Schemas
const ProfileUpdateSchema = z.object({
      name: z.string().optional(),
      avatarUrl: z.string().url().optional().or(z.literal("")),
      coverImageUrl: z.string().url().optional().or(z.literal("")),
      // For Vendor/Customer Bio
      bio: z.string().optional(),
      // For Vendor
      storeName: z.string().optional(),
});

const AddressSchema = z.object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      zip: z.string(),
      country: z.string(),
});

export const getProfile = async (req: AuthRequest, res: Response) => {
      try {
            const userId = req.user!.userId;
            const user = await prisma.user.findUnique({
                  where: { id: userId },
                  include: {
                        customer: { include: { addresses: true } },
                        vendor: true,
                  },
            });

            if (!user) return res.status(404).json({ message: "User not found" });

            // Remove password
            const { password, ...userProfile } = user;
            res.json(userProfile);
      } catch (error) {
            res.status(500).json({ message: "Error fetching profile" });
      }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
      try {
            const userId = req.user!.userId;
            const role = req.user!.role;
            const { name, storeName, bio, avatarUrl, coverImageUrl } = ProfileUpdateSchema.parse(req.body);

            const user = await prisma.user.update({
                  where: { id: userId },
                  data: {
                        name,
                        avatarUrl,
                        coverImageUrl,
                        vendor: role === "VENDOR" && (storeName || bio) ? {
                              update: {
                                    storeName,
                                    bio,
                              }
                        } : undefined,
                        customer: role === "CUSTOMER" && bio ? {
                              update: {
                                    bio,
                              }
                        } : undefined,
                  } as any,
                  include: {
                        customer: { include: { addresses: true } },
                        vendor: true,
                  },
            });

            const { password, ...updatedProfile } = user;
            res.json(updatedProfile);
      } catch (error) {
            if (error instanceof z.ZodError) {
                  return res.status(400).json({ errors: error.issues });
            }
            res.status(500).json({ message: "Error updating profile" });
      }
};

export const deleteProfile = async (req: AuthRequest, res: Response) => {
      try {
            const userId = req.user!.userId;

            // In a real app, you might want to soft delete or handle cascading deletes carefully.
            // For now, let's do a simple delete.
            await prisma.user.delete({
                  where: { id: userId },
            });

            res.json({ message: "User profile deleted successfully" });
      } catch (error) {
            res.status(500).json({ message: "Error deleting profile" });
      }
};

export const addAddress = async (req: AuthRequest, res: Response) => {
      try {
            const userId = req.user!.userId;
            const addressData = AddressSchema.parse(req.body);

            const customer = await prisma.customer.findUnique({ where: { userId } });
            if (!customer) return res.status(400).json({ message: "User is not a customer" });

            const address = await prisma.address.create({
                  data: {
                        ...addressData,
                        customerId: customer.id,
                  },
            });

            res.status(201).json(address);
      } catch (error) {
            if (error instanceof z.ZodError) {
                  return res.status(400).json({ errors: error.issues });
            }
            res.status(500).json({ message: "Error adding address" });
      }
};

export const updateAddress = async (req: AuthRequest, res: Response) => {
      try {
            const { id } = req.params;
            const addressData = AddressSchema.parse(req.body);

            const address = await prisma.address.update({
                  where: { id },
                  data: addressData,
            });

            res.json(address);
      } catch (error) {
            if (error instanceof z.ZodError) {
                  return res.status(400).json({ errors: error.issues });
            }
            res.status(500).json({ message: "Error updating address" });
      }
};

export const deleteAddress = async (req: AuthRequest, res: Response) => {
      try {
            const { id } = req.params;
            await prisma.address.delete({ where: { id } });
            res.json({ message: "Address deleted successfully" });
      } catch (error) {
            res.status(500).json({ message: "Error deleting address" });
      }
};
