// GET    /api/warehouse
// GET    /api/warehouse/:id
// POST   /api/warehouse
// PUT    /api/warehouse/:id
// DELETE /api/warehouse/:id

import { Router } from "express";
import {
    getWarehouse,
    getWarehouseById,
    createWarehouse,
    updateWarehouseById,
    deleteWarehouseById
} from "../controllers/warehouse.controller";

const router = Router();

// GET /api/warehouse
router.get('/', getWarehouse);

// GET /api/warehouse/:id
router.get('/:id', getWarehouseById);

// POST /api/warehouse
router.post('/:id', createWarehouse);

// PUT /api/warehouse
router.put('/:id', updateWarehouseById);

// DELETE /api/warehouse/:id
router.delete('/:id', deleteWarehouseById);

export default router;