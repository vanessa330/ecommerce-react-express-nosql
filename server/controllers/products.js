import { Product, Comment } from "../models/Product.js";
import User from "../models/User.js";
import mongoose from "mongoose";

/* CREATE */

export const createProduct = async (req, res) => {
  // URL/products
  try {
    const { userId, productName, price, description, picturePath } = req.body;
    const user = await User.findById(userId);

    const formattedPicPath = picturePath || "";

    const newProduct = new Product({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      userPicturePath: user.picturePath,
      productName,
      price,
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
    const { id, userId } = req.params;
    const { productName, price, description, picturePath } = req.body;
    const product = await Product.findById(id);

    if (userId === product.userId) {
      // Edit product details
      product.productName = productName;
      product.price = price;
      product.description = description;
      product.picturePath = picturePath;
    } else {
      res.status(404).send({ message: "User have no permissions" });
    }

    const updatedProduct = await product.save();

    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const likeProdcut = async (req, res) => {
  // URL/products/:id/:userId/like
  try {
    const { id, userId } = req.params;
    const product = await Product.findById(id);
    const isLiked = product.likes.get(userId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check the userId is already exists
    if (isLiked) {
      product.likes.delete(userId);
    } else {
      product.likes.set(userId, true);
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

export const addComment = async (req, res) => {
  // URL/products/:id/:userId/comment
  try {
    const { id, userId } = req.params;
    const { comment } = req.body;
    const { firstName, lastName } = await User.findById(userId);
    const product = await Product.findById(id);

    const newComment = new Comment({
      userId,
      firstName,
      lastName,
      comment,
    });

    await newComment.save();

    const commentId = new mongoose.Types.ObjectId();
    product.comments.set(commentId, newComment);

    const updatedProduct = await Product.findByIdAndUpdate(
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
  // URL/products/:id/:userId/delete
  try {
    const { id, userId } = req.params;
    const product = await Product.findById(id);

    if (userId === product.userId) {
      await Product.findByIdAndDelete(id);
    } else {
      res.status(404).send({ message: "User have no permissions" });
    }

    res.status(200).send({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
