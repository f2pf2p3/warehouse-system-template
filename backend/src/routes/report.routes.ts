// GET /api/report/inventory
// GET /api/report/stock-movement
import { Router } from "express";
import {
    getReportInventory,
    getStockMovement
} from "../controllers/report.controller";

const router = Router();

// GET /api/report/inventory
router.get("/inventory", getReportInventory);

// GET /api/report/stock-movement
router.get("/stock-movement", getStockMovement);

export default router;