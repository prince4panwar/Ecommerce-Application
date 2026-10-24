import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

// Schemas
const ProductSchema = z.object({
      name: z.string(),
      description: z.string(),
      price: z.number().positive(),
      stock: z.number().int().nonnegative(),
      categoryId: z.string(),
      images: z.string().optional(), // Comma separated for now
});

export const getProducts = async (req: Request, res: Response) => {
      try {
            const products = await prisma.product.findMany({
                  include: { category: true, vendor: true },
            });
            res.json(products);
      } catch (error) {
            res.status(500).json({ message: "Error fetching products" });
      }
};

export const getProductById = async (req: Request, res: Response) => {
      try {
            const { id } = req.params;
            const product = await prisma.product.findUnique({
                  where: { id },
                  include: { category: true, vendor: true, reviews: true },
            });
            if (!product) return res.status(404).json({ message: "Product not found" });
            res.json(product);
      } catch (error) {
            res.status(500).json({ message: "Error fetching product" });
      }
};

export const createProduct = async (req: AuthRequest, res: Response) => {
      try {
            // Ensure Vendor
            if (req.user?.role !== "VENDOR") {
                  return res.status(403).json({ message: "Only vendors can create products" });
            }

            const userId = req.user.userId;
            const vendor = await prisma.vendor.findUnique({ where: { userId } });
            if (!vendor) return res.status(400).json({ message: "Vendor profile not found" });

            const validatedData = ProductSchema.parse(req.body);

            const product = await prisma.product.create({
                  data: {
                        ...validatedData,
                        vendorId: vendor.id,
                        images: validatedData.images || "",
                  },
            });

            res.status(201).json(product);
      } catch (error) {
            if (error instanceof z.ZodError) {
                  return res.status(400).json({ errors: (error as any).errors || (error as any).issues });
            }
            console.error("Create Product Error:", error);
            res.status(500).json({ message: "Error creating product" });
      }
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
      try {
            if (req.user?.role !== "VENDOR") return res.status(403).json({ message: "Forbidden" });

            const { id } = req.params;
            const userId = req.user.userId;

            // Check ownership
            const product = await prisma.product.findUnique({ where: { id }, include: { vendor: true } });
            if (!product) return res.status(404).json({ message: "Product not found" });
            if (product.vendor.userId !== userId) return res.status(403).json({ message: "Not authorized to update this product" });

            const validatedData = ProductSchema.partial().parse(req.body);

            const updatedProduct = await prisma.product.update({
                  where: { id },
                  data: validatedData,
            });

            res.json(updatedProduct);
      } catch (error) {
            res.status(500).json({ message: "Error updating product" });
      }
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
      try {
            if (req.user?.role !== "VENDOR") return res.status(403).json({ message: "Forbidden" });

            const { id } = req.params;
            const userId = req.user.userId;

            const product = await prisma.product.findUnique({ where: { id }, include: { vendor: true } });
            if (!product) return res.status(404).json({ message: "Product not found" });
            if (product.vendor.userId !== userId) return res.status(403).json({ message: "Not authorized to delete this product" });

            await prisma.product.delete({ where: { id } });
            res.json({ message: "Product deleted" });
      } catch (error) {
            res.status(500).json({ message: "Error deleting product" });
      }
};

// Bulk create products
export const bulkCreateProducts = async (req: AuthRequest, res: Response) => {
      try {
            // Ensure Vendor
            if (req.user?.role !== "VENDOR") {
                  return res.status(403).json({ message: "Only vendors can create products" });
            }

            const userId = req.user.userId;
            const vendor = await prisma.vendor.findUnique({ where: { userId } });
            if (!vendor) return res.status(400).json({ message: "Vendor profile not found" });

            // Check current product count
            const currentProductCount = await prisma.product.count({
                  where: { vendorId: vendor.id }
            });

            if (currentProductCount >= 10) {
                  return res.status(403).json({
                        message: "Bulk product creation is only available for vendors with fewer than 10 products"
                  });
            }

            // Validate request body is an array
            if (!Array.isArray(req.body)) {
                  return res.status(400).json({ message: "Request body must be an array of products" });
            }

            const products = req.body;

            // Validate each product
            const validatedProducts = [];
            const errors = [];

            for (let i = 0; i < products.length; i++) {
                  try {
                        const validatedData = ProductSchema.parse(products[i]);
                        validatedProducts.push({
                              ...validatedData,
                              vendorId: vendor.id,
                              images: validatedData.images || "",
                        });
                  } catch (error) {
                        if (error instanceof z.ZodError) {
                              errors.push({
                                    index: i,
                                    product: products[i],
                                    errors: error.issues
                              });
                        }
                  }
            }

            // If there are validation errors, return them
            if (errors.length > 0) {
                  return res.status(400).json({
                        message: "Validation failed for some products",
                        errors
                  });
            }

            // Create all products in a transaction
            const createdProducts = await prisma.$transaction(
                  validatedProducts.map(product =>
                        prisma.product.create({ data: product })
                  )
            );

            res.status(201).json({
                  message: `Successfully created ${createdProducts.length} products`,
                  products: createdProducts
            });
      } catch (error) {
            console.error("Bulk Create Products Error:", error);
            res.status(500).json({ message: "Error creating products" });
      }
};

