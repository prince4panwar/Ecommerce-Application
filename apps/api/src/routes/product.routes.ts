import { Router } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkCreateProducts,
} from "../controllers/product.controller";
import { authenticate } from "../middleware/auth.middleware";

const router: Router = Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", authenticate, createProduct);
router.post("/bulk", authenticate, bulkCreateProducts);
router.put("/:id", authenticate, updateProduct);
router.delete("/:id", authenticate, deleteProduct);

export default router;
