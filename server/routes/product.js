const express = require("express");
const {
  getProducts,
  getUserProducts,
  likeProdcut,
  deleteProduct,
} = require("../controllers/products");

const router = express.Router();

/* CREATE */
// router.post("/", verifyToken, upload.single("file"), createProduct);

/* READ */
router.get("/", getProducts);
router.get("/:userId", getUserProducts);

/* UPDATE */
// router.put("/:id/edit", verifyToken, upload.single("file"), editProduct);
router.patch("/:id/like", likeProdcut);

/* DELETE */
router.delete("/:id/delete", deleteProduct);

module.exports = router;