const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();

const app = express(); // ✅ FIRST create app

// Middleware

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://communityhub3044.netlify.app",
    ],
    credentials: true,
  })
);
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes); // ✅ AFTER app is created

// DB Connection
connectDB();

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const protect = require("./middleware/authMiddleware");

app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "You accessed protected route",
    userId: req.user
  });
});

const postRoutes = require("./routes/postRoutes");

app.use("/api/posts", postRoutes);

app.use(
  "/api/reports",
  require("./routes/reportRoutes")
);

app.use(
  "/api/admin",
  require("./routes/adminRoutes")
);

app.use(
  "/api/notifications",
  require(
    "./routes/notificationRoutes"
  )
);