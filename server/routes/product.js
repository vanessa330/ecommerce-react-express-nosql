import express from "express";
import {
  getAllProducts,
  getUserProducts,
  likeProdcut,
  addComment,
} from "../controllers/products.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* CREATE */
// router.post("/", verifyToken, upload.single("file"), createProduct);

/* READ */
router.get("/", getAllProducts);
router.get("/:userId", getUserProducts);

/* UPDATE */
router.patch("/:id/:userId/like", verifyToken, likeProdcut);
router.patch("/:id/:userId/comment", verifyToken, addComment);

export default router;
