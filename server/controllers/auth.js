import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const register = async (req, res) => {
  // URL/auth/register/
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      followers,
      following,
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
      picturePath: "default_icon.png",
      followers,
      following,
    });

    const savedUser = await newUser.save();

    const responseData = {
      success: "You have successfully registered!",
      user: savedUser,
    };

    res.status(201).json(responseData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  // URL/auth/login/
  try {
    const { email, password } = req.body;

    // 1. CHECK if email exists using mongoose findOne()
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User does not exist" });

    // 2. CHECK if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Password incorrect" });

    // 3. Passing token
    const token = jwt.sign({ id: user.email }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    }); // "error": "secretOrPrivateKey must have a value"

    delete user.password;

    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
