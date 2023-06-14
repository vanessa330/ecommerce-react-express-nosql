const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const multer = require("multer");
const Stripe = require("stripe");
const { Cart, Order } = require("./models/Cart");
const User = require("./models/User");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const { addProduct, editProduct } = require("./controllers/products");
const { verifyToken } = require("./middleware/auth");
const { searchProducts } = require("./controllers/products");

/* CONFIGURATIONS */

dotenv.config();
const app = express();
app.use((req, res, next) => {
  if (req.originalUrl === "/webhook") {
    next();
  } else {
    express.json()(req, res, next);
  }
});
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [process.env.CLIENT_URL, "https://checkout.stripe.com"],
  })
);
app.use("/assets", express.static(path.join("public/assets")));
app.use(helmet()); // HTTP header for safty.
app.use(morgan("tiny")); // log HTTP requests

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

/* ROUTES */

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.post("/products/:adminId", verifyToken, upload.single("file"), addProduct);
app.put(
  "/products/:id/edit/:adminId",
  verifyToken,
  upload.single("file"),
  editProduct
);
app.get("/search", searchProducts);
app.use("/cart", cartRoutes);

/* STRIPE PAYMENT */

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.post(`/create-checkout-session`, async (req, res) => {
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
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      client_reference_id: id,
      // customer_email: userEmail,
      // billing_address_collection: "required",
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.CLIENT_URL}/cart/success`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
    });

    res.status(303).json({ url: session.url });
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

/* STRIPE WEBHOOK */

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const fulfillOrder = async (session) => {
  const { id } = session.client_reference_id; // cart id

  try {
    const cart = await Cart.findById(id);

    const newOrder = new Order({
      userId: cart.userId,
      items: cart.items,
      subTotal: cart.subTotal,
      status: "processing",
    });

    await newOrder.save();
    await cart.deleteOne({ _id: id });
  } catch (err) {
    console.error(err);
  }
};

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        fulfillOrder(session);
        break;
      }
      case "checkout.session.async_payment_succeeded": {
        // const session = event.data.object;
        break;
      }
      case "checkout.session.async_payment_failed": {
        // const session = event.data.object;
        break;
      }
    }

    res.status(200).json(event.data.object).end();
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
