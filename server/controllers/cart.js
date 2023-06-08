const { Item, Cart } = require("../models/Cart");
const Product = require("../models/Product");
const User = require("../models/User");

/* CREATE */

const addItemToCart = async (req, res) => {
  // URL/cart/add/:productId/:userId
  try {
    const { productId, userId } = req.params;
    const product = await Product.findById(productId);

    const productName = product.productName;
    const picturePath = product.picturePath;
    let quantity = 1;
    let price = product.price;
    let total = price * quantity;

    // 1. create a new cart schema
    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId });

    // 2. find the item in Cart schema
    let itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      // array index null
      cart.items.push(
        new Item({
          productId,
          productName,
          picturePath,
          quantity,
          price,
          total,
        })
      );
    } else {
      cart.items[itemIndex].quantity += quantity;
      cart.items[itemIndex].total += price * quantity;
    }

    cart.subTotal = cart.items.reduce((acc, item) => (acc += item.total), 0);

    await cart.save();

    return res.status(201).json(cart.toObject());
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
};

/* READ */

const getCart = async (req, res) => {
  // URL/cart/:userId
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId });

    if (!cart)
      return res
        .status(400)
        .send({ error: "There are no products in the cart." });

    res.status(200).json(cart.toObject());
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

/* UPDATE */

const subtractItem = async (req, res) => {
  // URL/subtract/:productId/:userId
  try {
    const { productId, userId } = req.params;

    const cart = await Cart.findOne({ userId });

    const item = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (!item) return res.status(404).send({ error: "Item not found in cart" });

    item.quantity -= 1;

    if (item.quantity === 0) {
      cart.items = cart.items.filter(
        (item) => item.productId.toString() !== productId
      );
    } else {
      item.total = item.price * item.quantity;
    }

    cart.subTotal = cart.items.reduce((acc, item) => acc + item.total, 0);

    await cart.save();

    return res.status(200).json(cart.toObject());
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
};

module.exports = { addItemToCart, getCart, subtractItem };