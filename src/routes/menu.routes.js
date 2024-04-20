import express from "express";

import {
  addItem,
  deleteItem,
  getMenuItems,
  updateAvailability,
  updateItem,
} from "../controllers/menu.controllers.js";
import { authMiddleware, validRole } from "../middleware/auth.middleware.js";
import multer from "multer";
import {
  addItemInput,
  updateAvailabilityValidation,
} from "../middleware/inputValidation.js";
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/menu");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const upload = multer({ storage });

router.post(
  "/",
  authMiddleware,
  validRole(["Admin"]),
  addItemInput,
  addItem
);

router.put(
  "/update/:itemId",
  authMiddleware,
  validRole(["Admin"]),
  upload.array("images"),
  addItemInput,
  updateItem
);

router.put(
  "/update-availability/:itemId",
  authMiddleware,
  validRole(["Admin"]),
  updateAvailabilityValidation,
  updateAvailability
);

router.delete(
  "/delete/:itemId",
  authMiddleware,
  validRole(["Admin"]),
  deleteItem
);

router.get("/items", getMenuItems);

export default router;
