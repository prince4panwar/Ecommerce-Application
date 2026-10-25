import { Router } from "express";
import { getCategories } from "../controllers/category.controller";

const router: Router = Router();

router.get("/", getCategories);

export default router;
