const Story = require("../models/Story");
const User = require("../models/User");

const getAllStories = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const [stories, total] = await Promise.all([
      Story.find().sort({ points: -1 }).skip(skip).limit(limit).lean(),
      Story.countDocuments(),
    ]);

    // If user is authenticated, mark bookmarked stories
    let bookmarkedIds = new Set();
    if (req.user) {
      const user = await User.findById(req.user._id).select("bookmarks");
      bookmarkedIds = new Set(user.bookmarks.map((id) => id.toString()));
    }

    const storiesWithBookmark = stories.map((story) => ({
      ...story,
      isBookmarked: bookmarkedIds.has(story._id.toString()),
    }));

    res.json({
      stories: storiesWithBookmark,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalStories: total,
        hasNextPage: skip + limit < total,
        hasPrevPage: page > 1,
        limit,
      },
    });
  } catch (error) {
    console.error("Get stories error:", error);
    res.status(500).json({ error: "Failed to fetch stories." });
  }
};

const getStoryById = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id).lean();
    if (!story) {
      return res.status(404).json({ error: "Story not found." });
    }

    let isBookmarked = false;
    if (req.user) {
      const user = await User.findById(req.user._id).select("bookmarks");
      isBookmarked = user.bookmarks.some(
        (id) => id.toString() === story._id.toString()
      );
    }

    res.json({ ...story, isBookmarked });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid story ID format." });
    }
    res.status(500).json({ error: "Failed to fetch story." });
  }
};

const toggleBookmark = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ error: "Story not found." });
    }

    const user = await User.findById(req.user._id);
    const storyId = story._id;
    const isBookmarked = user.bookmarks.some(
      (id) => id.toString() === storyId.toString()
    );

    if (isBookmarked) {
      user.bookmarks = user.bookmarks.filter(
        (id) => id.toString() !== storyId.toString()
      );
    } else {
      user.bookmarks.push(storyId);
    }

    await user.save();

    res.json({
      message: isBookmarked ? "Bookmark removed" : "Bookmark added",
      isBookmarked: !isBookmarked,
      bookmarks: user.bookmarks,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid story ID format." });
    }
    res.status(500).json({ error: "Failed to toggle bookmark." });
  }
};

const getBookmarkedStories = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: "bookmarks",
        options: { sort: { points: -1 } },
      })
      .lean();

    const stories = user.bookmarks.map((story) => ({
      ...story,
      isBookmarked: true,
    }));

    res.json({ stories });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bookmarks." });
  }
};

module.exports = {
  getAllStories,
  getStoryById,
  toggleBookmark,
  getBookmarkedStories,
};
