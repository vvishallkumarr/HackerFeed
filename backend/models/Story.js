const mongoose = require("mongoose");

const storySchema = new mongoose.Schema(
  {
    hnId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    url: {
      type: String,
      trim: true,
      default: null,
    },
    points: {
      type: Number,
      default: 0,
      min: 0,
    },
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
    },
    postedAt: {
      type: String,
      required: true,
    },
    commentCount: {
      type: Number,
      default: 0,
    },
    rank: {
      type: Number,
      required: true,
    },
    scrapedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for sorting by points
storySchema.index({ points: -1 });

module.exports = mongoose.model("Story", storySchema);
