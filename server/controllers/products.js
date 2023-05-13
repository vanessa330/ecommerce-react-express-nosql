import Product from "../models/Product.js";
import User from "../models/User.js";

/* CREATE */

export const createProduct = async (req, res) => {
  // URL/products
  try {
    const { userId, productName, quantity, description, picturePath } =
      req.body;
    const user = await User.findById(userId);

    const formattedPicPath = picturePath || "";

    const newProduct = new Product({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      userPicturePath: user.picturePath,
      productName,
      quantity,
      description,
      picturePath: formattedPicPath,
      likes: {},
      comments: {},
    });

    await newProduct.save();

    const products = await Product.find().sort({ updatedAt: -1 });
    res.status(201).json(products);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */

export const getAllProducts = async (req, res) => {
  // URL/products
  try {
    const products = await Product.find().sort({ updatedAt: -1 });

    res.status(200).json(products);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserProducts = async (req, res) => {
  // URL/products/:userId
  try {
    const { userId } = req.params;

    const products = await Product.find({ userId }).sort({ updatedAt: -1 });
    res.status(200).json(products);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */

export const patchProduct = async (req, res) => {
  // URL/products/:id/:userId
  try {
    const { id } = req.params;
    const { productName, quantity, description, picturePath } = req.body;
    const product = await Product.findById(id);

    // edit product details
    product.productName = productName;
    product.quantity = quantity;
    product.description = description;
    product.picturePath = picturePath;

    const updatedProduct = await product.save();

    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const likeProdcut = async (req, res) => {
  // URL/products/:id/like
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const product = await Product.findById(id);
    const isLiked = product.likes.get(userId);

    // Check the userId is already exists
    if (isLiked) {
      product.likes.delete(userId);
    } else {
      product.like.set(userId, true);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { likes: product.likes },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const patchComment = async (req, res) => {
  // URL/products/:id/comment
  try {
    const { id } = req.params;
    const { userId, comment } = req.body;
    const product = await product.findById(id);

    const updatedProduct = await product.findByIdAndUpdate(
      id,
      { comments: product.comments },
      { new: true }
    );

    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* DELETE */

export const deleteProduct = async (req, res) => {
  // URL/products/:id/delete
  try {
    const { id } = req.params;

    // Find the product by ID and delete it
    await Product.findByIdAndDelete(id);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
