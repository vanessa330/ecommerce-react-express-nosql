import express from "express";
import {
  createProduct,
  getAllProducts,
  getUserProducts,
  patchProduct,
  likeProdcut,
  patchComment,
  deleteProduct
} from "../controllers/products.js";
import { verifyToken } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

/* CREATE */
router.post("/", verifyToken, upload.single("picture"), createProduct);

/* READ */
router.get("/", getAllProducts);
router.get("/:userId", getUserProducts);

/* UPDATE */
router.patch("/:id/:userId", verifyToken, upload.single("picture"), patchProduct);
router.patch("/:id/like", verifyToken, likeProdcut);
router.patch("/:id/comment", verifyToken, patchComment);

/* DELETE */
router.delete("/:id/delete", verifyToken, deleteProduct);

export default router;
