const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const register = async (req, res) => {
  // URL/auth/register/
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      address,
      orders,
      wishlist,
      role,
    } = req.body;

    // 1. Check if the user exists
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ error: "User already exists" });

    // 2 Create a random salt and encrypt password.
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // 3. Create a new user object and return to frontend.
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashed,
      phone,
      address,
      orders,
      wishlist,
      role,
    });

    await newUser.save();

    res.status(201).json({ success: "You have successfully registered!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  // URL/auth/login/
  try {
    const { email, password } = req.body;

    // 1. CHECK if email exists using mongoose findOne()
    const loggedInUser = await User.findOne({ email });
    if (!loggedInUser)
      return res.status(400).json({ error: "User does not exist" });

    // 2. CHECK if password is correct
    const isMatch = await bcrypt.compare(password, loggedInUser.password);
    if (!isMatch) return res.status(400).json({ error: "Password incorrect" });

    // 3. Passing token
    const token = jwt.sign({ id: loggedInUser.email }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    }); // "error": "secretOrPrivateKey must have a value"

    delete loggedInUser.password;

    res.status(200).json({ token, loggedInUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { register, login };
