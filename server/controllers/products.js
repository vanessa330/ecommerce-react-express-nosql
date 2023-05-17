import { Product, Comment } from "../models/Product.js";
import User from "../models/User.js";
import mongoose from "mongoose";

/* CREATE */

export const createProduct = async (req, res) => {
  // URL/products
  try {
    // req.file
    const { userId, productName, price, description, picturePath } = req.body;
    const user = await User.findById(userId);

    const newProduct = new Product({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      userPicturePath: user.picturePath,
      productName,
      price,
      description,
      picturePath,
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

export const searchProducts = async (req, res) => {
  // URL/search?product=query
  try {
    const query = req.query.product;
    const regexString = query.replace(/\s+/g, "\\s+"); // Replace spaces with pattern that matches any white space character
    const regex = new RegExp(regexString, "i"); // "i" ignore the uppercase or lowercase

    const products = await Product.find({ productName: regex });

    res.status(200).json(products);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */

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

// export const addToCart = async (req, res) => {
//   // URL/product/:id/:userId/cart
//   try {
//     const { id, userId } = req.params;
//     const { product, quantity, price } = req.body;

//     const productObject = {
//       product: product,
//       quantity: quantity,
//       price: price,
//     };

//     const newOrder = await Order({
//       id,
//       product,
//       price,
//     });

//     await newOrder.save();

//     res.status(200).json(newOrder);
//   } catch (err) {
//     res.status(404).json({ message: err.message });
//   }
// };

// export const checkout = async (req, res) => {
//   // URL/product/:id/:userId/cart
//   try {
//     const { id, userId } = req.params;
//     const { product, quantity, price } = req.body;

//     const productObject = {
//       product: product,
//       quantity: quantity,
//       price: price,
//     };

//     const prodcutsArray = productObject.push(productObject);

//     const newOrder = await Order({
//       userId,
//       email,
//       products: prodcutsArray,
//       status: "pending",
//       totalPrice,
//     });

//     await newOrder.save();

//     res.status(200).json(newOrder);
//   } catch (err) {
//     res.status(404).json({ message: err.message });
//   }
// };
