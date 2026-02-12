import { Product } from "../models/product.model.js";
import mongoose from "mongoose";

export const uploadProduct = async (req, res) => {
  try {
    const { productName, price, description, category, stock, image } =
      req.body;

    if (
      !productName ||
      price === undefined ||
      !description ||
      !category ||
      stock === undefined
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (price < 0 || stock < 0) {
      return res
        .status(400)
        .json({ message: "Price and stock must be non-negative" });
    }

    const newProduct = await Product.create({
      productName,
      price,
      description,
      category,
      stock,
      image,
    });

    res.status(201).json({
      message: "Product uploaded successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error uploading product",
      error: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { productName, price, description, category, stock, image } =
      req.body;

    const updateFields = {};

    if (productName !== undefined) updateFields.productName = productName;
    if (price !== undefined) updateFields.price = price;
    if (description !== undefined) updateFields.description = description;
    if (category !== undefined) updateFields.category = category;
    if (stock !== undefined) updateFields.stock = stock;
    if (image !== undefined) updateFields.image = image;

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: "No fields provided for update" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating product",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    const deleteProduct = await Product.findByIdAndDelete(id);
    if (!deleteProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting product", error: error.message });
  }
};
export const toggleProductAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    product.isAvailable = !product.isAvailable;
    const updateProduct = await product.save();
    if (updateProduct) {
      return res.status(200).json({
        message: "Product availability toggled successfully",
        product: updateProduct,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error toggling product availability",
      error: error.message,
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ isAvailable: true });
    res.status(200).json({
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error fetching products",
      error: error.message,
    });
  }
};

export const getProductByName = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ message: "Product name is required" });
    }

    const products = await Product.find({
      productName: { $regex: name, $options: "i" }, // case-insensitive
      isAvailable: true,
    });

    if (!products.length) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product fetched successfully",
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching product by name",
      error: error.message,
    });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.query;

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    const products = await Product.find({
      category: { $regex: `^${category}$`, $options: "i" }, // case-insensitive exact match
      isAvailable: true,
    });

    if (!products.length) {
      return res
        .status(404)
        .json({ message: "No products found for this category" });
    }

    res.status(200).json({
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching products by category",
      error: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Product Id is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Product Id" });
    }
    const products = await Product.findById(id);
    if (!products) {
      return res.status(400).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product fetch Successfully", products });
  } catch (error) {
    res.status(400).json({
      message: "Error while fetching products by Id",
      error: error.message,
    });
  }
};
