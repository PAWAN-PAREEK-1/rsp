import express from "express";
import { categoryInput } from "../middleware/inputValidation.js";

import {
  addCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../controllers/category.controllers.js";
import { authMiddleware, validRole } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post(
  "/",
  authMiddleware,
  validRole(["Admin"]),
  categoryInput,
  addCategory
);

router.get("/", getCategories);

router.put(
  "/:categoryId",
  categoryInput,
  authMiddleware,
  validRole(["Admin"]),
  updateCategory
);

router.delete(
  "/:categoryId",
  authMiddleware,
  validRole(["Admin"]),
  deleteCategory
);

export default router;
