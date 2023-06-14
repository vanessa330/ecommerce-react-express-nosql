const express = require("express");
const { addItemToCart, getCart, subtractItem } = require("../controllers/cart");

const router = express.Router();

/* CREATE */
router.post("/add/:productId", addItemToCart);

/* READ */
router.get("/", getCart);

/* UPDATE */
router.patch("/subtract/:productId", subtractItem);

module.exports = router;