import { useState, useCallback } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

export const useStories = () => {
  const [stories, setStories] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { updateBookmarks } = useAuth();

  const fetchStories = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/stories?page=${page}&limit=${limit}`);
      setStories(data.stories);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load stories");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBookmarks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/stories/bookmarks");
      setStories(data.stories);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load bookmarks");
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleBookmark = useCallback(
    async (storyId) => {
      try {
        const { data } = await api.post(`/stories/${storyId}/bookmark`);
        // Update the bookmark state in both this list and auth context
        setStories((prev) =>
          prev.map((s) =>
            s._id === storyId ? { ...s, isBookmarked: data.isBookmarked } : s
          )
        );
        updateBookmarks(data.bookmarks);
        return { success: true, isBookmarked: data.isBookmarked };
      } catch (err) {
        return {
          success: false,
          error: err.response?.data?.error || "Failed to toggle bookmark",
        };
      }
    },
    [updateBookmarks]
  );

  return {
    stories,
    pagination,
    loading,
    error,
    fetchStories,
    fetchBookmarks,
    toggleBookmark,
  };
};
