const express = require("express");
const {
  getUser,
  addRemoveFollowing,
} = require("../controllers/users");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

/* READ */
router.get("/:id", getUser);
// router.get("/:id/following", getUserFollowing);

/* UPDATE */
router.patch("/:id/:followingId", verifyToken, addRemoveFollowing);

module.exports = router;