const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Create a new user
router.post("/", async (req, res) => {
  try {
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      date: Date.now(),
      role: req.body.role,
    });
    console.log(req.body);
    const user = await newUser.save();
    res.json(user);
  } catch (err) {
    res.status(200).json(err.message);
  }
});

/***********************************************************************/

// Endpoint to check user availability
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    // Find the user by email
    const user = await User.findOne({ email });
    console.log(user);
    // If user not found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    // If password does not match
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // If email and password match
    res.json({ message: "User authenticated", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
/***********************************************************************/

// // Get all users
// router.get("/",jwtToken, async (req, res) => {
//   try {
//     const users = await User.find();
//     console.log(users);
//     res.json(users);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // Get a single user by ID
// router.get("/users/:id", async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Update a user by ID
// router.put("/users/:id", async (req, res) => {
//   try {
//     const user = await User.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Delete a user by ID
// router.delete("/users/:id", async (req, res) => {
//   try {
//     await User.findByIdAndRemove(req.params.id);
//     res.json({ success: true });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

module.exports = router;
