import express from "express";
import {
  createOrder,
  acceptOrder,
  rejectOrder,
  assignDeliveryPerson,
  updateOrderStatus,
  cancelOrder,
  getOrders,
  getAllOrders,
  getOrderById,
  getOrdersByUserId,
} from "../controllers/order.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authenticate, createOrder);
router.put("/:id/accept", authenticate, authorize("admin"), acceptOrder);
router.put("/:id/reject", authenticate, authorize("admin"), rejectOrder);
router.put(
  "/:id/assign",
  authenticate,
  authorize("admin"),
  assignDeliveryPerson,
);
router.put("/:id/status", authenticate, updateOrderStatus);
router.put("/:id/cancel", authenticate, cancelOrder);

router.get("/", authenticate, getOrders);
router.get("/all", authenticate, authorize("admin"), getAllOrders);
router.get("/:id", authenticate, getOrderById);
router.get(
  "/user/:userId",
  authenticate,
  authorize("admin"),
  getOrdersByUserId,
);
