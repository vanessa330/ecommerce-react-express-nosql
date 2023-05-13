import express from "express";
import {
  getUser,
  getUserFollowers,
  getUserFollowing,
  addRemoveFollowing,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:id", getUser);
router.get("/:id/followers", getUserFollowers);
router.get("/:id/following", getUserFollowing);

/* UPDATE */
router.patch("/:id/:followingId", verifyToken, addRemoveFollowing);

export default router;
