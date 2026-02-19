import express from "express";
import {
  addToCart,
  updateCartItem,
  removeFromCart,
  getCartItems,
  clearCart,
  checkout,
} from "../controllers/cart.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/add", authenticate, addToCart);

router.put("/update", authenticate, updateCartItem);

router.delete("/remove", authenticate, removeFromCart);


router.get("/:userId", authenticate, getCartItems);

router.delete("/clear", authenticate, clearCart);

router.post("/checkout", authenticate, checkout);

export default router;
