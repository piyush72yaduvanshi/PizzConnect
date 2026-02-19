import { Cart } from "../models/cart.model.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import User from "../models/User.js";
import mongoose from "mongoose";

export const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || quantity === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(productId)
    ) {
      return res.status(400).json({ message: "Invalid userId and ProductId" });
    }
    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }
    const products = await Product.findById(productId);
    if (!products) {
      return res.status(404).json({ message: "Product not found" });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({
        userId,
        products: [{ productId, quantity, price: products.price }],
      });

      return res.status(200).json({
        message: "Product Added to cart successfully",
        cart,
      });
    }

    const productIndex = cart.products.findIndex(
      (item) => item.productId.toString() === productId,
    );
    if (productIndex > -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({
        productId,
        quantity,
        price: products.price,
      });
    }
    await cart.save();
    res.status(200).json({
      message: "Product Added to cart successfully",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding item to cart",
      error: error.message,
    });
  }
};
export const updateCartItem = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || quantity === undefined) {
      return res.status(400).json({ message: "All field are required" });
    }
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(productId)
    ) {
      return res.status(400).json({ message: "Invalid userId and ProductId" });
    }
    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }
    const cart = await Cart.findById(userId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const product = cart.products.find(
      (item) => item.productId.toString() === productId,
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    product.quantity = quantity;
    await cart.save();
    res.status(200).json({
      message: "Cart item updated successfully",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating cart item",
      error: error.message,
    });
  }
};
export const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(productId)
    ) {
      return res.status(400).json({ message: "Invalid userId and ProductId" });
    }

    const cart = await Cart.findById(userId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const initialLength = cart.products.length;
    cart.products = cart.products.filter(
      (item) => item.productId.toString() !== productId,
    );
    if (cart.products.length === initialLength) {
      return res.status(404).json({ message: "Product not found in cart" });
    }
    await cart.save();
    res.status(200).json({
      message: "Product removed from the cart successfuly",
      cart,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error while removing item from cart",
      error: error.message,
    });
  }
};

export const getCartItems = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ userId }).populate(
      "products.productId",
      "name price",
    );

    if (!cart) {
      return res.status(404).json({ message: "Cart is empty" });
    }

    res.status(200).json({
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching cart",
      error: error.message,
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOneAndDelete({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error clearing cart",
      error: error.message,
    });
  }
};

export const checkout = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user._id;
    const { deliveryAddress } = req.body;

    if (!deliveryAddress) {
      return res.status(400).json({
        message: "Delivery address is required",
      });
    }

    const cart = await Cart.findOne({ userId }).session(session);

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    for (const item of cart.products) {
      const product = await Product.findById(item.productId).session(session);

      if (!product || product.isDeleted) {
        throw new Error("Product not found");
      }

      if (product.stock < item.quantity) {
        throw new Error(
          `Insufficient stock for product: ${product.productName}`,
        );
      }
    }

    const deliveryPerson = await User.findOne({
      role: "deliveryman",
      available: true,
      status: "active",
    }).session(session);

    if (!deliveryPerson) {
      throw new Error("No delivery person available");
    }

    const order = await Order.create(
      [
        {
          userId,
          products: cart.products.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          totalCount: cart.totalCount,
          totalPrice: cart.totalPrice,
          deliveryPersonId: deliveryPerson._id,
          deliveryAddress,
          status: "confirmed",
        },
      ],
      { session },
    );

    for (const item of cart.products) {
      await Product.findByIdAndUpdate(
        item.productId,
        {
          $inc: { stock: -item.quantity },
        },
        { session },
      );
    }

    await Cart.findOneAndDelete({ userId }).session(session);

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "Order placed successfully",
      order: order[0],
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({
      message: "Checkout failed",
      error: error.message,
    });
  }
};
