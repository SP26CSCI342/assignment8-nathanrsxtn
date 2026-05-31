// server/server.js
// Assignment 7 — Express backend for PlateScout.
// Now backed by MongoDB Atlas (via Mongoose) with bcrypt-hashed passwords
// and JWT-based session tokens.

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware — mount BEFORE any route.
app.use(cors({
  origin: [
    "http://localhost:5173",                       // dev
    "https://your-platescout.vercel.app",          // <-- your Vercel URL (after Step D)
    /\.vercel\.app$/,                              // optional: preview branches
  ],
  credentials: true,
}));
app.use(express.json());

// Connect Mongoose to MongoDB Atlas.
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected.");
  })
  .catch((error) => {
    console.error(error);
  });

// User schema + model
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

// Shared validator — same as A6 (plain-text rules applied BEFORE we hash).
function validateInputs({ username, email, password }) {
  if (!username || username.trim().length < 3) {
    return "Username must be at least 3 characters.";
  }
  if (email !== undefined) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return "Please enter a valid email address.";
    }
  }
  if (!password || password.length < 8) {
    return "Password must be at least 8 characters.";
  }
  return "";
}

// ============================================================
// POST /api/register
// ============================================================
app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;

  const validationError = validateInputs({ username, email, password });
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    // Check whether a user with this username already exists.
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: "Username already taken." });
    }

    // Hash the password with bcrypt before saving.
    const hash = await bcrypt.hash(password, 10);

    // Create the user in MongoDB.
    const newUser = await User.create({ username, email, password: hash });
    return res.status(201).json({
      message: "User registered successfully.",
      user: { username: newUser.username, email: newUser.email },
    });
  } catch (error) {
    console.error("Register error:", error);
    // Mongoose duplicate-key error (race condition past the findOne check)
    if (error.code === 11000) {
      return res.status(409).json({ error: "Username or email already taken." });
    }
    return res.status(500).json({ error: "Server error." });
  }
});

// ============================================================
// POST /api/login
// ============================================================
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }

  try {
    // Find the user by username.
    const user = await User.findOne({ username });

    // Verify the password.
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        error: "Invalid username or password.",
      });
    }

    // Sign a JWT.
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    return res.status(200).json({
      message: "Login successful.",
      user: { username: user.username, email: user.email },
      token,   // the JWT — the client saves this in localStorage
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Server error." });
  }
});

// ============================================================
// POST /api/logout
// ============================================================
app.post("/api/logout", (req, res) => {
  // Read the Authorization header.
  const authHeader = req.headers.authorization;

  // Validate Authorization header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid token." });
  }

  // Extract token
  const token = authHeader.split(" ")[1];

  // Verify the token signature.
  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    // Ignore verification failures for logout
    console.warn("Token verification during logout failed:", error.message);
  }

  return res.status(200).json({ message: "Logged out." });
});

// ============================================================
// GET /api/health
// ============================================================
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    time: new Date().toISOString(),
    mongo: mongoose.connection.readyState === 1,
  });
});

// 404 fallback — must come AFTER every route or it'll eat them.
app.use((req, res) => {
  return res.status(404).json({ error: "Route not found." });
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
