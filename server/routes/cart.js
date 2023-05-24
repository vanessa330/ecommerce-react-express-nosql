import express from "express";
import { addItemToCart, getCart, subtractItem } from "../controllers/cart.js";

const router = express.Router();

/* CREATE */
router.post("/add/:productId/:userId", addItemToCart);

/* READ */
router.get("/:userId", getCart);

/* UPDATE */
router.patch("/subtract/:productId/:userId", subtractItem);

export default router;
