const crypto = require("crypto");
const UAParser = require("ua-parser-js");
const pool = require("../db");

// ==========================================
// Create a shortened URL
// ==========================================

const createShortUrl = async (req, res) => {
  try {
    const { originalUrl, customAlias, expiresAt } = req.body;
    console.log("REQ USER:", req.user);
    const userId = req.user?.userId || null;

    // Validate original URL
    if (!originalUrl) {
      return res.status(400).json({
        message: "Original URL is required",
      });
    }

    try {
      const parsedUrl = new URL(originalUrl);

      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        return res.status(400).json({
          message: "Only HTTP and HTTPS URLs are allowed",
        });
      }
    } catch (error) {
      return res.status(400).json({
        message: "Invalid URL",
      });
    }

    // Validate custom alias
    if (customAlias) {
      const alias = customAlias.trim();

      if (!/^[a-zA-Z0-9_-]+$/.test(alias)) {
        return res.status(400).json({
          message:
            "Custom alias can only contain letters, numbers, hyphens, and underscores",
        });
      }

      if (alias.length < 3 || alias.length > 20) {
        return res.status(400).json({
          message: "Custom alias must be between 3 and 20 characters",
        });
      }
    }

    // Reserved aliases
    const reservedAliases = [
      "api",
      "health",
      "admin",
      "login",
      "register",
      "dashboard",
    ];

    if (
      customAlias &&
      reservedAliases.includes(customAlias.trim().toLowerCase())
    ) {
      return res.status(400).json({
        message: "This alias is reserved and cannot be used",
      });
    }

    // Validate expiration date
    if (expiresAt) {
      const expirationDate = new Date(expiresAt);

      if (isNaN(expirationDate.getTime())) {
        return res.status(400).json({
          message: "Invalid expiration date",
        });
      }

      if (expirationDate <= new Date()) {
        return res.status(400).json({
          message: "Expiration date must be in the future",
        });
      }
    }

    // Generate short code
    const shortCode =
      customAlias && customAlias.trim()
        ? customAlias.trim()
        : crypto.randomBytes(4).toString("hex");

    // Save URL and associate it with logged-in user
    const result = await pool.query(
      `INSERT INTO short_urls
       (original_url, short_code, expires_at, user_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        originalUrl,
        shortCode,
        expiresAt || null,
        userId,
      ]
    );

    const url = result.rows[0];

    return res.status(201).json({
      message: "URL shortened successfully",
      shortCode: url.short_code,
      shortUrl: `http://localhost:5000/${url.short_code}`,
      expiresAt: url.expires_at,
    });
  } catch (error) {
    console.error("Create URL error:", error);

    // Duplicate short code / custom alias
    if (error.code === "23505") {
      return res.status(409).json({
        message: "Custom alias already exists",
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// ==========================================
// Redirect to original URL and record click
// ==========================================

const redirectToOriginalUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const result = await pool.query(
      `SELECT *
       FROM short_urls
       WHERE short_code = $1
       AND is_active = TRUE`,
      [shortCode]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Short URL not found",
      });
    }

    const url = result.rows[0];

    // Check if URL has expired
    if (url.expires_at && new Date(url.expires_at) <= new Date()) {
      return res.status(410).json({
        message: "This short URL has expired",
      });
    }

    // Record click
    await pool.query(
      `INSERT INTO url_clicks
       (short_url_id, ip_address, user_agent, referrer)
       VALUES ($1, $2, $3, $4)`,
      [
        url.id,
        req.ip,
        req.get("user-agent") || null,
        req.get("referer") || null,
      ]
    );

    // Update total click count
    await pool.query(
      `UPDATE short_urls
       SET click_count = click_count + 1
       WHERE id = $1`,
      [url.id]
    );

    // Redirect user
    return res.redirect(url.original_url);
  } catch (error) {
    console.error("Redirect error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// ==========================================
// Get recent URLs for logged-in user
// ==========================================

const getRecentUrls = async (req, res) => {
  try {
    const userId = req.user?.userId || null;

    const result = await pool.query(
      `SELECT
        id,
        original_url,
        short_code,
        created_at,
        expires_at,
        click_count,
        is_active
       FROM short_urls
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 10`,
      [userId]
    );

    return res.json(result.rows);
  } catch (error) {
    console.error("Get URLs error:", error);

    return res.status(500).json({
      message: "Unable to fetch URLs",
    });
  }
};

// ==========================================
// Get analytics for one URL
// ==========================================

const getUrlAnalytics = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId || null;

    // Check that URL belongs to logged-in user
    const urlResult = await pool.query(
      `SELECT
        id,
        original_url,
        short_code,
        created_at,
        expires_at,
        click_count,
        is_active
       FROM short_urls
       WHERE id = $1
       AND user_id = $2`,
      [id, userId]
    );

    if (urlResult.rows.length === 0) {
      return res.status(404).json({
        message: "Short URL not found",
      });
    }

    const url = urlResult.rows[0];

    // Get total clicks
    const clicksResult = await pool.query(
      `SELECT COUNT(*) AS total_clicks
       FROM url_clicks
       WHERE short_url_id = $1`,
      [id]
    );

    // Get clicks by date
    const clicksOverTimeResult = await pool.query(
      `SELECT
        DATE(day) AS date,
        COUNT(url_clicks.id) AS clicks
       FROM generate_series(
          DATE(
            (
              SELECT created_at
              FROM short_urls
              WHERE id = $1
              AND user_id = $2
            )
          ),
          CURRENT_DATE,
          INTERVAL '1 day'
       ) AS day
       LEFT JOIN url_clicks
         ON DATE(url_clicks.clicked_at) = DATE(day)
         AND url_clicks.short_url_id = $1
       GROUP BY DATE(day)
       ORDER BY DATE(day) ASC`,
      [id, userId]
    );

    // Get top referrers
    const referrersResult = await pool.query(
      `SELECT
        COALESCE(referrer, 'Direct') AS referrer,
        COUNT(*) AS clicks
       FROM url_clicks
       WHERE short_url_id = $1
       GROUP BY COALESCE(referrer, 'Direct')
       ORDER BY clicks DESC`,
      [id]
    );

    // Get user-agent data
    const userAgentsResult = await pool.query(
      `SELECT user_agent
       FROM url_clicks
       WHERE short_url_id = $1
       AND user_agent IS NOT NULL`,
      [id]
    );

    const browserCounts = {};
    const osCounts = {};
    const deviceCounts = {};

    userAgentsResult.rows.forEach((row) => {
      const parser = new UAParser(row.user_agent);
      const result = parser.getResult();

      const browser = result.browser.name || "Unknown";
      const os = result.os.name || "Unknown";

      let device = "Desktop";

      if (result.device.type === "mobile") {
        device = "Mobile";
      } else if (result.device.type === "tablet") {
        device = "Tablet";
      }

      browserCounts[browser] = (browserCounts[browser] || 0) + 1;
      osCounts[os] = (osCounts[os] || 0) + 1;
      deviceCounts[device] = (deviceCounts[device] || 0) + 1;
    });

    const browsers = Object.entries(browserCounts)
      .map(([browser, clicks]) => ({
        browser,
        clicks,
      }))
      .sort((a, b) => b.clicks - a.clicks);

    const operatingSystems = Object.entries(osCounts)
      .map(([os, clicks]) => ({
        os,
        clicks,
      }))
      .sort((a, b) => b.clicks - a.clicks);

    const devices = Object.entries(deviceCounts)
      .map(([device, clicks]) => ({
        device,
        clicks,
      }))
      .sort((a, b) => b.clicks - a.clicks);

    return res.json({
      url,
      totalClicks: Number(clicksResult.rows[0].total_clicks),
      clicksOverTime: clicksOverTimeResult.rows,
      topReferrers: referrersResult.rows,
      browsers,
      operatingSystems,
      devices,
    });
  } catch (error) {
    console.error("Analytics error:", error);

    return res.status(500).json({
      message: "Unable to fetch analytics",
    });
  }
};

// ==========================================
// Overall dashboard analytics
// ==========================================

const getDashboardAnalytics = async (req, res) => {
  try {
    const userId = req.user?.userId || null;

    // Total URLs
    const totalUrlsResult = await pool.query(
      `SELECT COUNT(*) AS total_urls
       FROM short_urls
       WHERE user_id = $1`,
      [userId]
    );

    // Total clicks
    const totalClicksResult = await pool.query(
      `SELECT COUNT(*) AS total_clicks
       FROM url_clicks c
       JOIN short_urls s
         ON s.id = c.short_url_id
       WHERE s.user_id = $1`,
      [userId]
    );

    // Active URLs
    const activeUrlsResult = await pool.query(
      `SELECT COUNT(*) AS active_urls
       FROM short_urls
       WHERE user_id = $1
       AND is_active = TRUE
       AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)`,
      [userId]
    );

    // Expired URLs
    const expiredUrlsResult = await pool.query(
      `SELECT COUNT(*) AS expired_urls
       FROM short_urls
       WHERE user_id = $1
       AND expires_at IS NOT NULL
       AND expires_at <= CURRENT_TIMESTAMP`,
      [userId]
    );

    // Clicks over time
    const clicksOverTimeResult = await pool.query(
      `SELECT
        DATE(day) AS date,
        COUNT(c.id) AS clicks
       FROM generate_series(
         (
           SELECT MIN(DATE(created_at))
           FROM short_urls
           WHERE user_id = $1
         ),
         CURRENT_DATE,
         INTERVAL '1 day'
       ) AS day
       LEFT JOIN url_clicks c
         ON DATE(c.clicked_at) = DATE(day)
         AND c.short_url_id IN (
           SELECT id
           FROM short_urls
           WHERE user_id = $1
         )
       GROUP BY DATE(day)
       ORDER BY DATE(day) ASC`,
      [userId]
    );

    // Top-performing links
    const topLinksResult = await pool.query(
      `SELECT
        id,
        short_code,
        original_url,
        click_count,
        created_at
       FROM short_urls
       WHERE user_id = $1
       ORDER BY click_count DESC
       LIMIT 5`,
      [userId]
    );

    // Get browser, OS and device analytics
    // only for this user's URLs
    const userAgentsResult = await pool.query(
      `SELECT c.user_agent
       FROM url_clicks c
       JOIN short_urls s
         ON s.id = c.short_url_id
       WHERE s.user_id = $1
       AND c.user_agent IS NOT NULL`,
      [userId]
    );

    const browserCounts = {};
    const osCounts = {};
    const deviceCounts = {};

    userAgentsResult.rows.forEach((row) => {
      const parser = new UAParser(row.user_agent);
      const result = parser.getResult();

      const browser = result.browser.name || "Unknown";
      const os = result.os.name || "Unknown";

      let device = "Desktop";

      if (result.device.type === "mobile") {
        device = "Mobile";
      } else if (result.device.type === "tablet") {
        device = "Tablet";
      }

      browserCounts[browser] = (browserCounts[browser] || 0) + 1;
      osCounts[os] = (osCounts[os] || 0) + 1;
      deviceCounts[device] = (deviceCounts[device] || 0) + 1;
    });

    const browsers = Object.entries(browserCounts)
      .map(([browser, clicks]) => ({
        browser,
        clicks,
      }))
      .sort((a, b) => b.clicks - a.clicks);

    const operatingSystems = Object.entries(osCounts)
      .map(([os, clicks]) => ({
        os,
        clicks,
      }))
      .sort((a, b) => b.clicks - a.clicks);

    const devices = Object.entries(deviceCounts)
      .map(([device, clicks]) => ({
        device,
        clicks,
      }))
      .sort((a, b) => b.clicks - a.clicks);

    // Top referrers
    const referrersResult = await pool.query(
      `SELECT
        COALESCE(c.referrer, 'Direct') AS referrer,
        COUNT(*) AS clicks
       FROM url_clicks c
       JOIN short_urls s
         ON s.id = c.short_url_id
       WHERE s.user_id = $1
       GROUP BY COALESCE(c.referrer, 'Direct')
       ORDER BY clicks DESC
       LIMIT 10`,
      [userId]
    );

    return res.json({
      totalUrls: Number(totalUrlsResult.rows[0].total_urls),
      totalClicks: Number(totalClicksResult.rows[0].total_clicks),
      activeUrls: Number(activeUrlsResult.rows[0].active_urls),
      expiredUrls: Number(expiredUrlsResult.rows[0].expired_urls),
      clicksOverTime: clicksOverTimeResult.rows,
      topLinks: topLinksResult.rows,
      referrers: referrersResult.rows,
      browsers,
      operatingSystems,
      devices,
    });
  } catch (error) {
    console.error("Dashboard analytics error:", error);

    return res.status(500).json({
      message: "Unable to fetch dashboard analytics",
    });
  }
};

// ==========================================
// Exports
// ==========================================

module.exports = {
  createShortUrl,
  redirectToOriginalUrl,
  getRecentUrls,
  getUrlAnalytics,
  getDashboardAnalytics,
};