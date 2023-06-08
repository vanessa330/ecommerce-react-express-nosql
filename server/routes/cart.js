const express = require("express");
const { addItemToCart, getCart, subtractItem } = require("../controllers/cart");

const router = express.Router();

/* CREATE */
router.post("/add/:productId/:userId", addItemToCart);

/* READ */
router.get("/:userId", getCart);

/* UPDATE */
router.patch("/subtract/:productId/:userId", subtractItem);

module.exports = router;