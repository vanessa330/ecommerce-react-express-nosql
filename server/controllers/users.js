const User = require("../models/User");
const Product = require("../models/Product");
const { Order } = require("../models/Cart");

/* READ */

const getUser = async (req, res) => {
  // URL/users/:id
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    res.status(200).json(user);
  } catch (err) {
    res.status(404).send({ message: err.message });
  }
};

const getUsers = async (req, res) => {
  // URL/users
  try {
    const users = await User.find().sort({ updatedAt: -1 }).limit(8);

    res.status(200).json(users);
  } catch (err) {
    res.status(404).send({ message: err.message });
  }
};

const getUserWishlist = async (req, res) => {
  // URL/users/:id/wishlist
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    const wishlist = user.wishlist;

    const products = await Promise.all(
      wishlist.map(async (productId) => {
        const product = await Product.findOne({ _id: productId });
        return {
          _id: product._id,
          productName: product.productName,
          price: product.price,
          quantity: product.quantity,
          picturePath: product.picturePath,
        };
      })
    );

    res.status(200).json(products);
  } catch (err) {
    res.status(404).send({ message: err.message });
  }
};

const getUserOrder = async (req, res) => {
  // URL/users/:id/order
  try {
    const { id } = req.params;
    const userOrders = await Order.find({ userId: id }).sort({ updatedAt: -1 });

    const orders = userOrders.map((order) => {
      return {
        orderId: order._id,
        items: order.items.map((item) => {
          return {
            productId: item.productId,
            productName: item.productName,
            price: item.price,
            quantity: item.quantity,
            picturePath: item.picturePath,
          };
        }),
        subTotal: order.subTotal,
        status: order.status,
      };
    });

    res.status(200).json(orders);
  } catch (err) {
    res.status(404).send({ message: err.message });
  }
};

/* UPDATE */

const addRemoveWishlist = async (req, res) => {
  // URL/users/id/wishlist/:productId
  try {
    const { userId, productId } = req.params;
    const { action } = req.query;
    const user = await User.findById(userId);

    if (action === "add") {
      user.wishlist.addToSet(productId);
    } else if (action === "remove") {
      user.wishlist.pull(productId);
    } else {
      throw new Error("Invalid action");
    }

    await user.save();

    res.status(200).json(user.wishlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getUser,
  getUsers,
  getUserWishlist,
  getUserOrder,
  addRemoveWishlist,
};
