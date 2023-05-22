import express from "express";
import {
  getProducts,
  getUserProducts,
  likeProdcut,
  addComment,
} from "../controllers/products.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* CREATE */
// router.post("/", verifyToken, upload.single("file"), createProduct);

/* READ */
router.get("/", getProducts);
router.get("/:userId", getUserProducts);

/* UPDATE */
router.patch("/:id/like", likeProdcut);
router.patch("/:id/:userId/comment", verifyToken, addComment);

export default router;
