const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const multer = require("multer");
const Stripe = require("stripe");
const { buffer } = require("micro");
const { Cart } = require("./models/Cart");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const { createProduct, editProduct } = require("./controllers/products");
const { verifyToken } = require("./middleware/auth");
const { searchProducts } = require("./controllers/products");

/* CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet()); // HTTP header for safty.
app.use(morgan("tiny")); // log HTTP requests
app.use(
  cors({
    origin: [process.env.CLIENT_URL, "https://checkout.stripe.com"],
  })
);
app.use("/assets", express.static(path.join("public/assets")));

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

/* STRIPE PAYMENT SETUP */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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

/* STRIPE PAYMENT WEBHOOK SETUP */
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

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
  express.raw({ type: "application/json" }),
  async (req, res) => {
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        req.headers["stripe-signature"],
        endpointSecret
      );
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
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
    res.status(200).end();
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
