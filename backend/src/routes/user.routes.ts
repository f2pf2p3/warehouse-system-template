// GET /api/user
// GET /api/user/:id

import Router from "express";
import {
    getUser,
    getUserById
} from "../controllers/user.controller.js";

const router = Router();

// GET /api/user
router.get("/", getUser);

// GET /api/user/:id
router.get("/", getUserById);

export default router;