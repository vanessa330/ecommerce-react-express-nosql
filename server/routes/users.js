import express from "express";
import {
  getUser,
  addRemoveFollowing,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:id", getUser);
// router.get("/:id/following", getUserFollowing);

/* UPDATE */
router.patch("/:id/:followingId", verifyToken, addRemoveFollowing);

export default router;
