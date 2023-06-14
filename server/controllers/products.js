const Product = require("../models/Product");
const User = require("../models/User");

/* CREATE */

const addProduct = async (req, res) => {
  // URL/products/:adminId
  try {
    const { adminId } = req.params;
    const admin = await User.findById(adminId);
    if (admin.role !== "admin")
      return res.status(404).json({ error: "You do not have permission." });

    const {
      productName,
      price,
      quantity,
      description,
      picturePath, // req.file
      category,
      brand,
      likes,
      reviews,
    } = req.body;

    const newProduct = new Product({
      productName,
      price: parseFloat(price).toFixed(2),
      quantity: parseInt(quantity).toFixed(0),
      description,
      picturePath,
      category,
      brand,
      likes: {},
      reviews,
    });

    await newProduct.save();

    const savedProduct = await Product.findById(newProduct._id);

    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
};

/* READ */

const getProductIds = async (req, res) => {
  // URL/products
  try {
    const products = await Product.find().sort({ updatedAt: -1 });

    const productIds = products.map((p) => p._id);

    res.status(200).json(productIds);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

const getProduct = async (req, res) => {
  // URL/products/:id
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    res.status(200).json(product);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

const searchProducts = async (req, res) => {
  // URL/search?product=query
  try {
    const query = req.query.product;
    const regexString = query.replace(/\s+/g, "\\s+"); // Replace spaces with pattern that matches any white space character
    const regex = new RegExp(regexString, "i"); // "i" ignore the uppercase or lowercase

    const searchProducts = await Product.find({ productName: regex }).limit(8);

    res.status(200).json(searchProducts);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

/* UPDATE */

const editProduct = async (req, res) => {
  // URL/products/:id/edit/:adminId
  try {
    const { id, adminId } = req.params;
    const {
      productName,
      price,
      quantity,
      description,
      picturePath,
      category,
      brand,
    } = req.body;

    const admin = await User.findById(adminId);

    if (admin.role !== "admin")
      return res.status(404).json({ error: "You do not have permission." });

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          productName: productName,
          price,
          quantity: quantity,
          description: description,
          picturePath: picturePath,
          category: category,
          brand: brand,
        },
      },
      { new: true }
    );

    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
};

const likeProdcut = async (req, res) => {
  // URL/products/:id/like
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const user = await User.findById(userId);
    const product = await Product.findById(id);
    const isLiked = product.likes.get(userId);

    if (isLiked) {
      product.likes.delete(userId);
      user.wishlist = user.wishlist.filter((p) => p !== id);
    } else {
      product.likes.set(userId, true);
      user.wishlist.push(id);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { likes: product.likes },
      { new: true }
    );

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { wishlist: user.wishlist },
      { new: true }
    );

    res.status(200).json({ updatedProduct, updatedUser });
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
};

/* DELETE */

const deleteProduct = async (req, res) => {
  // URL/products/:id/delete/:adminId
  try {
    const { id, adminId } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);
    const admin = await User.findById(adminId);

    if (admin.role !== "admin")
      return res.status(404).json({ error: "You do not have permission." });

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
};

module.exports = {
  addProduct,
  getProductIds,
  getProduct,
  searchProducts,
  editProduct,
  likeProdcut,
  deleteProduct,
};
