import express from "express";
import { register, login, getCurrentUser,forgotPassword,resetPassword } from "../Controllers/AuthController.js";
import { verifyToken } from "../Middleware/auth.js";

const router = express.Router();

// Auth routes
router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyToken, getCurrentUser);

// Add these routes
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;