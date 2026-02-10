import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: [100, "Product name must be less than 100 characters"],
      index: true,
    },

    price: {
      type: Number,
      required: true,
      min: [0, "Price must be a positive number"],
    },

    description: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: [500, "Description must be less than 500 characters"],
    },

    // 🔹 Fixed spelling + scalable categories
    category: {
      type: String,
      enum: ["veg", "non-veg"],
      required: true,
      default: "veg",
      index: true,
    },

    imageUrl: {
      type: String,
      trim: true,
    },

    stock: {
      type: Number,
      required: true,
      min: [0, "Stock cannot be negative"],
      default: 0,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
productSchema.index({ productName: "text" });
productSchema.index({ category: 1, isAvailable: 1 });

productSchema.pre("save", function (next) {
  this.isAvailable = this.stock > 0;
  next();
});

export const Product = mongoose.model("Product", productSchema);
