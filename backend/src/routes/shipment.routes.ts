// GET  /api/shipment
// POST /api/shipment

import { Router } from "express";
import {
    getShipment,
    createShipment
} from "../controllers/shipment.controller.js";

const router = Router();

// GET  /api/shipment
router.get("/", getShipment);

// POST /api/shipment
router.post("/", createShipment);

export default router;