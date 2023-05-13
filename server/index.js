import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import User from "./models/User.js";
import Product from "./models/Product.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import productRoutes from "./routes/product.js";

/* CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet()); // HTTP header for safty.
app.use(morgan("tiny")); // log HTTP requests
app.use(cors()); // access server response
// PENDING
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/assets", express.static(path.join(__dirname, "public/assets")));


/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/products", productRoutes);


/* DATABASE SETUP */
const PORT = process.env.PORT || 6001;

mongoose
  .connect(process.env.MONGO_URL, {
    useNewURLParser: true, // allow fall back to the old parser.
    useUnifiedTopology: true, // stable connection.
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Port : ${PORT}`);
      User.insertMany([]);
      Product.insertMany([]);
    });
  })
  .catch((err) => console.log(`${err} did not connect`));


