// GET /api/inventory
// GET /api/inventory/:id
// POST /api/inventory/stock-in
// POST /api/inventory/stock-out
// PUT /api/inventory/:id

import { Router } from "express";
import {
    getInventory,
    getInventoryById,
    createInventoryStockIn,
    createInventoryStockOut,
    updateInventory,
} from "../controllers/inventory.controller";

const router = Router();

// GET /api/inventory
router.get("/", getInventory);

// GET /api/inventory/:id
router.get("/:id", getInventoryById);

// POST /api/inventory/stock-in
router.post("/stock-in", createInventoryStockIn);

// POST /api/inventory/stock-out
router.post("/stock-out", createInventoryStockOut);

// PUT /api/inventory/:id
router.put("/:id", updateInventory);

export default router;
