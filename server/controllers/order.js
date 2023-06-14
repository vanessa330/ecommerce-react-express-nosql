const { Cart, Order } = require("../models/Cart");
const Product = require("../models/Product");

/* CREATE */

const addOrder = async (req, res) => {
  // URL/order/add/:userId
  try {
    const { userId } = req.body;
    const cart = await Cart.findOne({ userId });

    const newOrder = new Order({
      userId: cart.userId,
      cartItems: cart,
      status: "processing",
    });

    await newOrder.save();

    // Clear the user's cart
    cart.items = [];
    cart.subTotal = 0;
    await cart.save();

    res.status(201).json(newOrder);
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
};

/* READ */

const getUserOrder = async (req, res) => {
  // URL/order/:userId
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).sort({ updatedAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* UPDATE */

const updateOrder = async (req, res) => {
  // URL/order/:id
    try {
      const { orderId } = req.params;
      const { status } = req.body;
  
      const order = await Order.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      );
  
      res.status(200).json(order);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

module.exports = { addOrder, getUserOrder, updateOrder };
