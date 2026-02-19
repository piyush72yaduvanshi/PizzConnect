import express from "express";
import {
  register,
  login,
  logout,
  updateProfile,
  changePassword,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", protect, logout);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);

export default router;
