import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one cart per user (important)
    },

    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity must be at least 1"],
          default: 1,
        },
        price: {
          type: mongoose.Schema.Types.Number,
          ref: "Product.price",
          required: true, // snapshot price
        },
      },
    ],

    totalCount: {
      type: Number,
      default: 0,
    },

    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

cartSchema.index({ userId: 1 });
cartSchema.index({ "products.productId": 1 });
cartSchema.pre("save", function (next) {
  this.totalCount = this.products.reduce((acc, item) => acc + item.quantity, 0);
  this.totalPrice = this.products.reduce((acc, item) => acc + (item.quantity * item.price), 0);
  next();
});

export const Cart = mongoose.model("Cart", cartSchema);
