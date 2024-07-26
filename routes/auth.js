const express = require("express");
const authRouter = express.Router();
const User = require("../models/User"); // Ensure the correct path to the User model
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtToken = process.env.JWT_SECRET;
// Endpoint to check user availability
// authRouter.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   console.log(email, password);
//   console.log("Inside Login method");
//   try {
//     // Find the user by email
//     const user = await User.findOne({ email });
//     console.log("user found", user);
//     // If user not found
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Debug: Log the user object
//     console.log("Retrieved User:", user);

//     // Check if password matches
//     const isMatch = await user.comparePassword(password);

//     // If password does not match
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     // If email and password match

//     const token = jwt.sign({ id: user._id }, "your_jwt_secret", {
//       expiresIn: "1h",
//     });
//     res.json({ message: "User authenticated", user, token });
//     console.log(token, user);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Find the user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  console.log(user);
  // Check if password matches
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  console.log("generating token");
  // Generate token
  const token = jwt.sign({ id: user._id, email: user.email }, jwtToken, {
    expiresIn: "1h",
  });
  res.json({ token, user, message: "User Authonticated..." });
});

module.exports = authRouter;
