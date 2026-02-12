import {
  updateProduct,
  deleteProduct,
  toggleProductAvailability,
  getAllProducts,
  getProductsByCategory,
  getProductByName,
  getProductById,
  uploadProduct,
} from "../controllers/product.controller";

import express from "express";

const router = express.Router();

router.post("/upload",uploadProduct);
router.put("/update/:id", updateProduct);
router.delete("/delete/:id", deleteProduct);
router.patch("/toggle-availability/:id", toggleProductAvailability);
router.get("/all", getAllProducts);
router.get("/category", getProductsByCategory);
router.get("/name", getProductByName);
router.get("/id/:id", getProductById);

export default router;

