import express from "express";
import { register, login } from "../controllers/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

/* CREATE */

router.post("/register", upload.single("picture"), register);
router.post("/login", login);

export default router;
