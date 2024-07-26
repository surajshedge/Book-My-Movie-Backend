// // app.js
const connectDB = require("../database/db");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const users = require("../routes/users");
const morgan = require("morgan"); // Import morgan
const cors = require("cors"); // Import cors
const authRoutes = require("../routes/auth");
const ticketBookingRouter = require("../routes/ticketBookingRouter");
const jwt = require("jsonwebtoken");

// Middleware
app.use(express.json());
app.use(morgan("dev"));
const jwtToken = process.env.JWT_SECRET;
console.log(jwtToken);
connectDB();
app.use(bodyParser.json());

// Routes
const authenticateJWT = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];
  console.log(token);
  if (!token) {
    console.log("No token provided"); // Debug log
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("Token verification failed", err); // Debug log
      return res.sendStatus(403); // Forbidden
    }
    req.user = user;
    next();
  });
};

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://another-allowed-origin.com",
      "https://z032glnb-5173.inc1.devtunnels.ms",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options(
  "*",
  cors({
    origin: [
      "http://localhost:5173",
      "https://z032glnb-5173.inc1.devtunnels.ms",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.get("/protected-endpoint", authenticateJWT, (req, res) => {
  res.send("Token is valid");
});
app.use("/api/users", users);
app.use("/api/auth/", authRoutes);
app.use("/api", authenticateJWT, ticketBookingRouter);

const port = process.env.PORT || 9000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
