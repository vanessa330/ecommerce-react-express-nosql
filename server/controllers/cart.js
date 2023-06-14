const { Item, Cart } = require("../models/Cart");
const Product = require("../models/Product");

/* CREATE */

const addItemToCart = async (req, res) => {
  // URL/cart/add/:productId
  try {
    const { productId } = req.params;
    const { id } = req.body; // cart id
    const product = await Product.findById(productId);

    const productName = product.productName;
    const picturePath = product.picturePath;
    let quantity = 1;
    let price = product.price;
    let total = price * quantity;

    // 1. create a new cart schema
    let cart;

    if (id) {
      cart = await Cart.findById(id);
    } else {
      cart = new Cart();
    }

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
          price: parseFloat(price).toFixed(2),
          total: parseFloat(total).toFixed(2),
        })
      );
    } else {
      cart.items[itemIndex].quantity += quantity;
      cart.items[itemIndex].total += price * quantity;
    }

    cart.subTotal = cart.items
      .reduce((acc, item) => (acc += item.total), 0)
      .toFixed(2);

    await cart.save();

    res.status(201).json(cart);
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
};

/* READ */

const getCart = async (req, res) => {
  // URL/cart/:id?
  try {
    const { id } = req.params;
    const cart = await Cart.findById(id);

    if (!cart)
      return res
        .status(400)
        .send({ error: "There are no products in the cart." });

    res.status(200).json(cart);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

/* UPDATE */

const subtractItem = async (req, res) => {
  // URL/subtract/:productId
  try {
    const { productId } = req.params;
    const { id } = req.body;
    const cart = await Cart.findById(id);

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

    cart.subTotal = cart.items
      .reduce((acc, item) => acc + item.total, 0)
      .toFixed(2);

    await cart.save();

    res.status(200).json(cart.toObject());
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
};

const updatedCartUserId = async (req, res) => {
  // URL/cart/:id?
  try {
    const { id } = req.params;
    const { userId } = req.body;
    let cart = await Cart.findById(id);

    if (!cart)
      return res
        .status(400)
        .send({ error: "There are no products in the cart." });

    if (userId) {
      cart = await Cart.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            userId: userId,
          },
        },
        { new: true }
      );
    }

    res.status(200).json(cart);
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
};

module.exports = { addItemToCart, getCart, subtractItem, updatedCartUserId };
