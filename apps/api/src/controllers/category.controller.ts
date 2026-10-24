import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getCategories = async (req: Request, res: Response) => {
      try {
            let categories = await prisma.category.findMany();

            // If no categories exist, create a default one
            if (categories.length === 0) {
                  const defaultCategory = await prisma.category.create({
                        data: {
                              name: "General"
                        }
                  });
                  categories = [defaultCategory];
            }

            res.json(categories);
      } catch (error) {
            console.error("Get Categories Error:", error);
            res.status(500).json({ message: "Error fetching categories" });
      }
};
