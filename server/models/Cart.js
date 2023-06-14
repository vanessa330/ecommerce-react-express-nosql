const mongoose = require("mongoose");

const ItemSchema = mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  productName: {
    type: String,
  },
  picturePath: {
    type: String,
    default: "",
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
});

const CartSchema = mongoose.Schema(
  {
    userId: String, // or Guest
    items: [ItemSchema],
    subTotal: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const OrderSchema = mongoose.Schema(
  {
    userId: String, // or Guest
    items: [ItemSchema],
    subTotal: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ["processing", "shipped", "delivered", "cancelled"],
      default: "processing",
    },
  },
  {
    timestamps: true,
  }
);

const Item = mongoose.model("Item", ItemSchema);
const Cart = mongoose.model("Cart", CartSchema);
const Order = mongoose.model("Order", OrderSchema);

module.exports = { Item, Cart, Order };
