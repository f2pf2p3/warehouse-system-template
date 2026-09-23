//POST   /api/auth/register
//POST   /api/auth/login
//GET    /api/auth/me

import { Router } from "express";
import {
    registerUser,
    loginUser
} from "../controllers/auth.controller";

const router = Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get('/me', (req, res) => {
    res.json({ message: 'Authenticated user info' });
});

export default router;