const express = require("express");

const authMiddleware = require("../middleware/auth.middleware");

const authenticateToken = authMiddleware;
const { optionalAuthenticateToken } = authMiddleware;

const {
  createShortUrl,
  getRecentUrls,
  getUrlAnalytics,
  getDashboardAnalytics,
} = require("../controllers/url.controller");

const router = express.Router();

// Public URL shortening
// Logged-in user ho to user_id automatically attach hoga
router.post(
  "/",
  optionalAuthenticateToken,
  createShortUrl
);

// Protected routes
router.get(
  "/",
  authenticateToken,
  getRecentUrls
);

router.get(
  "/analytics/overview",
  authenticateToken,
  getDashboardAnalytics
);

router.get(
  "/:id/analytics",
  authenticateToken,
  getUrlAnalytics
);

module.exports = router;