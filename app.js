// // app.js
const connectDB = require("./database/db");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const users = require("./routes/users");
const morgan = require("morgan"); // Import morgan
const cors = require("cors"); // Import cors
const authRoutes = require("./routes/auth");
const ticketBookingRouter = require("./routes/ticketBookingRouter");
const jwt = require("jsonwebtoken");

// Middleware
app.use(express.json());
app.use(morgan("dev"));
const jwtToken = process.env.JWT_SECRET;
console.log(jwtToken);
connectDB();
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send("Welcome to the movie ticket booking API!");
});

// // CORS Configuration
// const corsOptions = {
//   origin: ["http://localhost:5173", "https://bookmymovietickets.netlify.app"],
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   allowedHeaders: ["Content-Type", "Authorization"],
// };

// // Apply CORS middleware
// app.use(cors(corsOptions));

// // Handle preflight requests
// app.options("*", cors(corsOptions));


// const corsOptions = {
//   origin: (origin, callback) => {
//     // Allow requests from specified origins or if no origin is provided (e.g., for testing)
//     if (
//       !origin ||
//       /https:\/\/book-my-movie-backend-.*\.vercel\.app/.test(origin) ||
//       origin === "https://bookmymovietickets.netlify.app"
//     ) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   allowedHeaders: ["Content-Type", "Authorization"],
// };

app.use(cors({
  origin: 'https://bookmymovietickets.netlify.app', // Your frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Apply CORS middleware
app.use(cors(corsOptions));
// Handle preflight requests
app.options("*", cors(corsOptions));

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Preflight request handling



// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173",
//       "http://another-allowed-origin.com",
//       "https://bookmymovietickets.netlify.app",
//     ],
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );
// app.options("*", cors()); // Preflight requests handling

// app.options(
//   "*",
//   cors({
//     origin: [
//       "http://localhost:5173",
//       "https://bookmymovietickets.netlify.app",
//     ],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );
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
app.get("/protected-endpoint", authenticateJWT, (req, res) => {
  res.send("Token is valid");
});
app.use("/api/users", users);
app.use("/api/auth/", authRoutes);
app.use("/api", authenticateJWT, ticketBookingRouter);

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
