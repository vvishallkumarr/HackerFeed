import React from "react";
import { useAuth } from "../context/AuthContext";

const getDomain = (url) => {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return null;
  }
};

const BookmarkIcon = ({ filled }) => (
  <svg
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth={2}
    width={18}
    height={18}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
    />
  </svg>
);

const PointsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
  </svg>
);

const AuthorIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const TimeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="10" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
  </svg>
);

const StoryCard = ({ story, onToggleBookmark, index }) => {
  const { user } = useAuth();
  const domain = story.url ? getDomain(story.url) : null;

  const handleBookmark = async (e) => {
    e.preventDefault();
    if (onToggleBookmark) onToggleBookmark(story._id);
  };

  const animationDelay = `${Math.min(index * 40, 400)}ms`;

  return (
    <div
      className="story-card"
      style={{ animationDelay }}
    >
      <div className="story-rank">
        <span className="story-rank-num">{story.rank}</span>
      </div>

      <div className="story-body">
        <a
          href={story.url || `https://news.ycombinator.com/item?id=${story.hnId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="story-title"
        >
          {story.title}
        </a>

        {domain && <div className="story-domain">{domain}</div>}

        <div className="story-meta">
          <span className="meta-item meta-points">
            <PointsIcon />
            {story.points} pts
          </span>
          <span className="meta-item">
            <AuthorIcon />
            {story.author}
          </span>
          <span className="meta-item">
            <TimeIcon />
            {story.postedAt}
          </span>
        </div>
      </div>

      {user && (
        <div className="story-actions">
          <button
            className={`bookmark-btn ${story.isBookmarked ? "bookmarked" : ""}`}
            onClick={handleBookmark}
            title={story.isBookmarked ? "Remove bookmark" : "Add bookmark"}
            aria-label={story.isBookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            <BookmarkIcon filled={story.isBookmarked} />
          </button>
        </div>
      )}
    </div>
  );
};

export default StoryCard;
