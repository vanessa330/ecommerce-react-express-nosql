import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import productRoutes from "./routes/product.js";
import { createProduct } from "./controllers/products.js";
import { verifyToken } from "./middleware/auth.js";
import { searchProducts } from "./controllers/products.js";

/* CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet()); // HTTP header for safty.
app.use(morgan("tiny")); // log HTTP requests
app.use(cors()); // access server response

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/assets", express.static(path.join(__dirname, "public/assets"))); // files stored in the public/assets directory will be accessible to clients making requests.

/* MIDDLEWARE FILE UPLOAD STORAGE */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null, "public/assets"); // local storage
    cb(null, "/mnt/data/uploads"); // render.com storage .yaml file
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

/* ROUTES WIHT FILE */
app.post("/products", verifyToken, upload.single("file"), createProduct);
/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.get("/search", searchProducts);

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
    });
  })
  .catch((err) => console.log(`${err} did not connect`));
