import express from "express";
import {
  activeDeactiveInput,
  changePasswordInputValidator,
  loginInputValidator,
  registerInputValidator,
  updateProfileInput,
} from "../middleware/inputValidation.js";
import {
  activateDeactive,
  changePassword,
  getProfile,
  getUserById,
  getUsers,
  login,
  registerUser,
  updateProfile,
} from "../controllers/user.controllers.js";
import { authMiddleware, validRole } from "../middleware/auth.middleware.js";
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/user");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const upload = multer({ storage });

const router = express.Router();

router.get("/me", authMiddleware, getProfile);

router.post(
  "/register",
  authMiddleware,
  validRole(["Admin"]),
  registerInputValidator,
  registerUser
);

router.post("/login", loginInputValidator, login);

router.put(
  "/change-password",
  changePasswordInputValidator,
  authMiddleware,
  changePassword
);

router.put(
  "/activate-deactivate/:userId",
  activeDeactiveInput,
  authMiddleware,
  validRole(["Admin"]),
  activateDeactive
);

router.put(
  "/update-profile",
  authMiddleware,
  (req, _, next) => {
    const userId = req.user._id;
    req.userId = userId;
    next();
  },
  updateProfileInput,
  updateProfile
);

router.put(
  "/update-profile/:userId",
  authMiddleware,
  validRole(["Admin"]),
  (req, _, next) => {
    const userId = req.params.userId;
    req.userId = userId;
    next();
  },
  updateProfileInput,
  updateProfile
);

router.get(
  "/profile/:userId",
  authMiddleware,
  validRole(["Admin"]),
  getUserById
);

router.get("/all", authMiddleware, validRole(["Admin"]), getUsers);

export default router;
