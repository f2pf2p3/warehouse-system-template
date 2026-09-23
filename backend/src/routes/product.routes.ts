// GET    /api/product
// POST   /api/product
// GET    /api/product/:id
// PUT    /api/product/:id
// DELETE /api/product/:id

import { Router } from "express";
import {
    getProduct,
    getProductById,
    createProduct,
    updateProductById,
    deleteProductById,
} from "../controllers/product.controller";

const router = Router();

// GET /api/product
router.get("/", getProduct);

// POST /api/products
router.post("/", createProduct);

// GET /api/products/:id
router.get("/:id", getProductById);

// PUT /api/products/:id
router.put("/:id", updateProductById);

// DELETE /api/products/:id
router.delete("/:id", deleteProductById);

export default router;