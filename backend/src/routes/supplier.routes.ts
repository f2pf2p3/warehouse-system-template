// GET	    /api/supplier
// GET	    /api/supplier/:id	
// POST	    /api/supplier	
// PUT	    /api/supplier/:id	
// DELETE	/api/supplier/:id	

import { Router } from "express"
import {
    getSupplier,
    getSupplierById,
    createSupplier,
    updateSupplierById,
    deleteSupplierById
} from "../controllers/supplier.controller";

const router = Router();

// GET /api/supplier
router.get('/', getSupplier);

// GET /api/supplier/:id
router.get('/:id', getSupplierById);

// POST /api/supplier
router.post('/', createSupplier);

// PUT /api/supplier/:id
router.put('/:id', updateSupplierById);

// DELETE /api/supplier/:id
router.delete('/:id', deleteSupplierById);

export default router;