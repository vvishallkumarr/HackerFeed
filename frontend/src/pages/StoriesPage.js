import React, { useEffect, useState, useCallback } from "react";
import StoryCard from "../components/StoryCard";
import { useStories } from "../hooks/useStories";
import api from "../utils/api";
import toast from "react-hot-toast";

const SkeletonCard = () => (
  <div className="skeleton skeleton-card" />
);

const RefreshIcon = ({ spinning }) => (
  <svg
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    width={15} height={15}
    style={{ transition: "transform 0.5s", transform: spinning ? "rotate(360deg)" : "none" }}
  >
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const StoriesPage = () => {
  const { stories, pagination, loading, error, fetchStories, toggleBookmark } = useStories();
  const [page, setPage] = useState(1);
  const [scraping, setScraping] = useState(false);
  const [scrapeMsg, setScrapeMsg] = useState("");

  useEffect(() => {
    fetchStories(page, 10);
  }, [page, fetchStories]);

  const handleToggleBookmark = useCallback(
    async (storyId) => {
      const result = await toggleBookmark(storyId);
      if (result.success) {
        toast.success(result.isBookmarked ? "Bookmarked!" : "Removed bookmark");
      } else {
        toast.error(result.error);
      }
    },
    [toggleBookmark]
  );

  const handleScrape = async () => {
    setScraping(true);
    setScrapeMsg("");
    try {
      const { data } = await api.post("/scrape");
      setScrapeMsg(`✓ ${data.saved} stories updated`);
      toast.success(`Scraped ${data.saved} stories`);
      fetchStories(page, 10);
    } catch (err) {
      const msg = err.response?.data?.error || "Scrape failed";
      toast.error(msg);
      setScrapeMsg(`✗ ${msg}`);
    } finally {
      setScraping(false);
    }
  };

  return (
    <main className="page-container">
      <div className="stories-header">
        <h1>
          Top <span>Stories</span>
        </h1>
        <div className="scrape-btn-container">
          {scrapeMsg && <span className="scrape-status">{scrapeMsg}</span>}
          <button
            className="btn btn-ghost btn-sm"
            onClick={handleScrape}
            disabled={scraping}
          >
            <RefreshIcon spinning={scraping} />
            {scraping ? "Scraping…" : "Refresh"}
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">{error}</div>
      )}

      <div className="story-list">
        {loading
          ? Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
          : stories.map((story, i) => (
              <StoryCard
                key={story._id}
                story={story}
                index={i}
                onToggleBookmark={handleToggleBookmark}
              />
            ))}
      </div>

      {!loading && stories.length === 0 && !error && (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <h3>No stories yet</h3>
          <p>Click "Refresh" to scrape the latest stories from Hacker News.</p>
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            className="btn btn-ghost btn-sm"
            disabled={!pagination.hasPrevPage || loading}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Prev
          </button>
          <span className="pagination-info">
            {pagination.currentPage} / {pagination.totalPages}
          </span>
          <button
            className="btn btn-ghost btn-sm"
            disabled={!pagination.hasNextPage || loading}
            onClick={() => setPage((p) => p + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </main>
  );
};

export default StoriesPage;
