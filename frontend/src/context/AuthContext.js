import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import api from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  const persistUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      persistUser(data.user);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || "Login failed",
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (username, email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", {
        username,
        email,
        password,
      });
      localStorage.setItem("token", data.token);
      persistUser(data.user);
      return { success: true };
    } catch (err) {
      const errors = err.response?.data?.errors;
      const message = errors
        ? errors[0].msg
        : err.response?.data?.error || "Registration failed";
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  const updateBookmarks = useCallback((bookmarks) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, bookmarks };
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isBookmarked = useCallback(
    (storyId) => {
      return user?.bookmarks?.some((id) => {
        const idStr = typeof id === "object" ? id._id || id.toString() : id;
        return idStr === storyId;
      }) || false;
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateBookmarks, isBookmarked }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
