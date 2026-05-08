import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <div className="navbar-logo">HN</div>
        <span className="navbar-title">
          Hacker<span>Feed</span>
        </span>
      </Link>

      <div className="navbar-actions">
        <NavLink
          to="/"
          className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          end
        >
          Stories
        </NavLink>

        {user && (
          <NavLink
            to="/bookmarks"
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          >
            Bookmarks
          </NavLink>
        )}

        {user ? (
          <>
            <div className="user-chip">
              <div className="user-avatar">{user.username[0]}</div>
              <span className="user-name">{user.username}</span>
            </div>
            <button onClick={handleLogout} className="btn btn-ghost btn-sm">
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
