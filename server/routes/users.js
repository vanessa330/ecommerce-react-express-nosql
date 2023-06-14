const express = require("express");
const {
  getUser,
  getUsers,
  getUserWishlist,
  addRemoveWishlist,
} = require("../controllers/users");
// const { verifyToken } = require("../middleware/auth");

const router = express.Router();

/* READ */
router.get("/:id", getUser);
router.get("/", getUsers);
router.get("/:id/wishlist", getUserWishlist);

/* UPDATE */
router.patch("/:id/wishlist/:productId", addRemoveWishlist);

module.exports = router;
