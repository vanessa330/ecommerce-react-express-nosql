import mongoose from "mongoose";

const ProductSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    userPicturePath: String,
    productName: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    description: String,
    picturePath: {
      type: String,
      default: "",
    },
    likes: {
      type: Map, // key/value pairs.
      of: Boolean, // userId: true
    },
    comments: {
      type: Map, // key/value pairs.
      of: String, // userId: comment
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);

export default Product;
