const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/auth");
const storyRoutes = require("./routes/stories");
const scrapeRoutes = require("./routes/scrape");
const { runScraper } = require("./controllers/scraperController");
const path = require("path");
dotenv.config();

const app = express();
const _dirname=path.resolve();

// ====================
// Middleware
// ====================

app.use(cors());

app.use(express.json());

app.set("trust proxy", 1);

// ====================
// Rate Limiter
// ====================

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: "Too many requests, please try again later.",
  },
});

app.use("/api/", limiter);

// ====================
// Routes
// ====================

app.use("/api/auth", authRoutes);

app.use("/api/stories", storyRoutes);

app.use("/api", scrapeRoutes);

// ====================
// Health Check
// ====================

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

// ====================
// 404 Handler
// ====================

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

// ====================
// Global Error Handler
// ====================

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

// ====================
// Database Connection
// ====================

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("✅ MongoDB Connected");

    // ====================
    // Start Server
    // ====================

    const PORT = process.env.PORT || 5000;
    app.use(express.static(path.join(_dirname,"/frontend/dist")))
    app.get('*',(req,res)=>{
      res.sendFile(path.resolve(_dirname,"frontend","dist","index.html"));
    })
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    // ====================
    // Initial Scraper Run
    // ====================

    try {
      console.log("🕷️ Running initial scraper...");

      await runScraper();

      console.log("✅ Initial scraper completed");
    } catch (error) {
      console.error("❌ Scraper error:", error.message);
    }
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);

    process.exit(1);
  });