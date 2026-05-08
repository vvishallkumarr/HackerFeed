import React, { useEffect, useCallback } from "react";
import StoryCard from "../components/StoryCard";
import { useStories } from "../hooks/useStories";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const BookmarksPage = () => {
  const { stories, loading, error, fetchBookmarks, toggleBookmark } = useStories();
  const { user } = useAuth();

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const handleToggleBookmark = useCallback(
    async (storyId) => {
      const result = await toggleBookmark(storyId);
      if (result.success) {
        if (!result.isBookmarked) {
          toast.success("Bookmark removed");
          // Refetch to update the list
          fetchBookmarks();
        }
      } else {
        toast.error(result.error);
      }
    },
    [toggleBookmark, fetchBookmarks]
  );

  return (
    <main className="page-container">
      <div className="page-header">
        <h1>
          My Bookmarks
        </h1>
        <p>
          {user?.username}'s saved stories
          {stories.length > 0 && ` · ${stories.length} saved`}
        </p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="story-list">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton skeleton-card" />
          ))}
        </div>
      ) : stories.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔖</div>
          <h3>No bookmarks yet</h3>
          <p>
            Visit the stories page and click the bookmark icon on stories you
            want to save.
          </p>
        </div>
      ) : (
        <div className="story-list">
          {stories.map((story, i) => (
            <StoryCard
              key={story._id}
              story={story}
              index={i}
              onToggleBookmark={handleToggleBookmark}
            />
          ))}
        </div>
      )}
    </main>
  );
};

export default BookmarksPage;
