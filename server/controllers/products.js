import { Product, Comment } from "../models/Product.js";
import User from "../models/User.js";

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
    res.status(409).json({ error: err.message });
  }
};

/* READ */

export const getProducts = async (req, res) => {
  // URL/products
  try {
    const products = await Product.find().sort({ updatedAt: -1 });

    res.status(200).json(products);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

export const getUserProducts = async (req, res) => {
  // URL/products/:userId
  try {
    const { userId } = req.params;

    const products = await Product.find({ userId }).sort({ updatedAt: -1 });

    res.status(200).json(products);
  } catch (err) {
    res.status(404).json({ error: err.message });
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
    res.status(404).json({ error: err.message });
  }
};

/* UPDATE */

export const likeProdcut = async (req, res) => {
  // URL/products/:id/like
  try {
    const { id } = req.params;
    const guestOrUserId =
      req.body.userId || Math.floor(Math.random() * 10000000).toString();
    const product = await Product.findById(id);
    const isLiked = product.likes.get(guestOrUserId);

    if (!product) {
      return res.status(404).send({ error: "Product not found" });
    }

    // Check the userId is already exists
    if (isLiked) {
      product.likes.delete(guestOrUserId);
    } else {
      product.likes.set(guestOrUserId, true);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { likes: product.likes },
      { new: true }
    );

    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(409).json({ error: err.message });
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
    res.status(409).json({ error: err.message });
  }
};
