const express = require("express");
const {
  getProducts,
  getProduct,
  likeProdcut,
  deleteProduct,
} = require("../controllers/products");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

/* CREATE */
// router.post("/", verifyToken, upload.single("file"), addProduct);

/* READ */
router.get("/", getProducts);
router.get("/:id", getProduct);

/* UPDATE */
// router.put("/:id/edit", verifyToken, upload.single("file"), editProduct);
router.patch("/:id/like", likeProdcut);

/* DELETE */
router.delete("/:id/delete/:adminId", verifyToken, deleteProduct);

module.exports = router;
