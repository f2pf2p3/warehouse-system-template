// GET    /api/purchase-order
// GET    /api/purchase-order/:id
// POST   /api/purchase-order
// PUT    /api/purchase-order/:id
// DELETE /api/purchase-order/:id
// POST   /api/purchase-order/:id/approve

import { Router } from "express";
import {
    getPurchaseOrder,
    getPurchaseOrderById,
    createPurchaseOrder,
    updatePurchaseOrderById,
    deletePurchaseOrderById,
    createPurchaseApprovedOrderById
} from '../controllers/purchase-order.controller.js';

const router = Router();

// GET /api/purchase-order
router.get('/', getPurchaseOrder);

// GET /api/purchase-order/:id
router.get('/:id', getPurchaseOrderById);

// POST /api/purchase-order
router.post('/', createPurchaseOrder);

// PUT /api/purchase-order/:id
router.put('/:id', updatePurchaseOrderById);

// DELETE /api/purchase-order/:id
router.delete('/:id', deletePurchaseOrderById);

// POST /api/purchase-order/:id
router.post("/:id/approve", createPurchaseApprovedOrderById);

export default router;