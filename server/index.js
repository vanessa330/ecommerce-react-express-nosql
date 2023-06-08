import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import multer from "multer";
import Stripe from "stripe";
import bodyParser from "body-parser";
import { Cart } from "./models/Cart.js";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import productRoutes from "./routes/product.js";
import cartRoutes from "./routes/cart.js";
import { createProduct, editProduct } from "./controllers/products.js";
import { verifyToken } from "./middleware/auth.js";
import { searchProducts } from "./controllers/products.js";

/* CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet()); // HTTP header for safty.
app.use(morgan("tiny")); // log HTTP requests
app.use(
  cors({
    // origin: ["http://localhost:3000", "https://checkout.stripe.com"],
    origin: [process.env.CLIENT_URL, "https://checkout.stripe.com"],
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/assets", express.static(path.join(__dirname, "public/assets"))); // files stored in the public/assets directory will be accessible to clients making requests.

/* MIDDLEWARE FILE UPLOAD STORAGE */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

/* ROUTES WIHT FILE */
app.post("/products", verifyToken, upload.single("file"), createProduct);
app.put("/products/:id/edit", verifyToken, upload.single("file"), editProduct);
/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.get("/search", searchProducts);
app.use("/cart", cartRoutes);

/* PAYMENT SETUP */
const stripe = new Stripe(process.env.STRIPE_KEY);

app.post("/create-checkout-session", async (req, res) => {
  const { id } = req.body;
  const cart = await Cart.findById(id);
  const items = cart.items;
  try {
    const lineItems = items.map((item) => {
      return {
        price_data: {
          currency: "hkd",
          product_data: {
            name: item.productName,
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      client_reference_id: id,
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: process.env.CLIENT_URL,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
    });

    res.status(303).json({ url: session.url });
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  } finally {
    await Cart.deleteOne({ _id: id });
  }
});

// TESTING ENDPOINT
const endpointSecret = process.env.STRIPE_SIGNING;

const fulfillOrder = (lineItems) => {
  console.log("Fulfilling order", lineItems);
};

const createOrder = (session) => {
  console.log("Creating order", session);
};

const emailCustomerAboutFailedPayment = (session) => {
  console.log("Emailing customer", session);
};

app.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  (requests, response) => {
    const payload = requests.body;
    const sig = requests.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err) {
      return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        createOrder(session);
        if (session.payment_status === "paid") {
          fulfillOrder(session);
        }
        break;
      }
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object;
        fulfillOrder(session);
        break;
      }
      case "checkout.session.async_payment_failed": {
        const session = event.data.object;
        emailCustomerAboutFailedPayment(session);
        break;
      }
    }
    response.status(200).end();
  }
);

/* DATABASE SETUP */
const PORT = process.env.PORT;

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
