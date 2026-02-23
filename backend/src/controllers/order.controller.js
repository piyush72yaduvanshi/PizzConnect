import { Order } from "../models/order.model.js";
import User from "../models/User.js";

export const createOrder = async (req, res) => {
  try {
    const order = await Order.create({
      ...req.body,
      userId: req.user._id,
      status: "pending",
    });

    res.status(201).json({
      message: "Order created",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Order creation failed",
      error: error.message,
    });
  }
};

export const acceptOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order)
      return res.status(404).json({ message: "Order not found" });

    if (order.status !== "pending") {
      return res.status(400).json({
        message: "Only pending orders can be accepted",
      });
    }

    order.status = "confirmed";
    await order.save();

    res.status(200).json({
      message: "Order accepted",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Order accept failed",
      error: error.message,
    });
  }
};

export const rejectOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order)
      return res.status(404).json({ message: "Order not found" });

    if (order.status !== "pending") {
      return res.status(400).json({
        message: "Only pending orders can be rejected",
      });
    }

    order.status = "cancelled";
    await order.save();

    res.status(200).json({
      message: "Order rejected",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Order reject failed",
      error: error.message,
    });
  }
};

export const assignDeliveryPerson = async (req, res) => {
  try {
    const { deliveryPersonId } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order)
      return res.status(404).json({ message: "Order not found" });

    const deliveryPerson = await User.findById(deliveryPersonId);
    if (!deliveryPerson || deliveryPerson.role !== "deliveryman") {
      return res
        .status(400)
        .json({ message: "Invalid delivery person" });
    }

    order.deliveryPersonId = deliveryPersonId;
    order.status = "out-for-delivery";
    await order.save();

    res.status(200).json({
      message: "Delivery person assigned",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Assignment failed",
      error: error.message,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatus = [
      "preparing",
      "out-for-delivery",
      "delivered",
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(req.params.id);
    if (!order)
      return res.status(404).json({ message: "Order not found" });

    if (
      req.user.role === "deliveryman" &&
      order.deliveryPersonId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not your order" });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      message: "Order status updated",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Status update failed",
      error: error.message,
    });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order)
      return res.status(404).json({ message: "Order not found" });

    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (!["pending", "confirmed"].includes(order.status)) {
      return res.status(400).json({
        message: "Order cannot be cancelled at this stage",
      });
    }

    order.status = "cancelled";
    await order.save();

    res.status(200).json({
      message: "Order cancelled",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Cancel failed",
      error: error.message,
    });
  }
};


export const getOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.user._id });
  res.status(200).json({ orders });
};

export const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("products.productId");

  if (!order)
    return res.status(404).json({ message: "Order not found" });

  res.status(200).json({ order });
};

export const getOrdersByUserId = async (req, res) => {
  const orders = await Order.find({ userId: req.params.userId });
  res.status(200).json({ orders });
};

export const getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate("userId", "name email")
    .populate("deliveryPersonId", "name");

  res.status(200).json({ orders });
};

export const getOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);
  res.status(200).json({ status: order.status });
};


