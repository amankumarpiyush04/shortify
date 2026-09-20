const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db");
const urlRoutes = require("./routes/url.routes");
const authRoutes = require("./routes/auth.routes");
const authenticateToken = require("./middleware/auth.middleware");
const { redirectToOriginalUrl } = require("./controllers/url.controller");

const app = express();

// Middleware must come before routes
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/urls", urlRoutes);
app.get("/api/auth-test", authenticateToken, (req, res) => {
  res.json({
    message: "Authentication successful",
    user: req.user,
  });
});
// Redirect short URLs
app.get("/:shortCode", redirectToOriginalUrl);

app.get("/", (req, res) => {
  res.json({
    message: "Shortify API is running",
  });
});

app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      status: "OK",
      database: "Connected",
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "ERROR",
      database: "Not connected",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Shortify server running on http://localhost:${PORT}`);
});

