const express = require("express");
const { addItemToCart, getCart, subtractItem, updatedCartUserId } = require("../controllers/cart");

const router = express.Router();

/* CREATE */
router.post("/add/:productId", addItemToCart);

/* READ */
router.get("/:id?", getCart);

/* UPDATE */
router.patch("/subtract/:productId", subtractItem);
router.patch("/:id?", updatedCartUserId);

module.exports = router;