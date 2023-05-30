import mongoose from "mongoose";
import Product from "./Product.js";

const ItemSchema = mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    productName: {
      type: String,
    },
    picturePath: {
      type: String,
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
  },
  { timestamps: true }
);

ItemSchema.pre("save", async function (next) {
  try {
    const product = await Product.findById(this.productId);
    this.productName = product.productName;
    this.picturePath = product.picturePath;
    next();
  } catch (err) {
    next(err);
  }
});

const CartSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    items: [ItemSchema],
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    subTotal: {
      default: 0,
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Item = mongoose.model("Item", ItemSchema);
const Cart = mongoose.model("Cart", CartSchema);

export { Item, Cart };
