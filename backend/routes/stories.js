const express = require("express");
const {
  getAllStories,
  getStoryById,
  toggleBookmark,
  getBookmarkedStories,
} = require("../controllers/storiesController");
const { protect } = require("../middleware/auth");

// Optional auth middleware – attaches user if token exists, but doesn't block
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const jwt = require("jsonwebtoken");
      const User = require("../models/User");
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
    }
  } catch {
    // Invalid token — just proceed without user
  }
  next();
};

const router = express.Router();

router.get("/", optionalAuth, getAllStories);
router.get("/bookmarks", protect, getBookmarkedStories);
router.get("/:id", optionalAuth, getStoryById);
router.post("/:id/bookmark", protect, toggleBookmark);

module.exports = router;
