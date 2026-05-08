import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (form.username.length < 3) errs.username = "At least 3 characters required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Invalid email address";
    if (form.password.length < 6) errs.password = "At least 6 characters required";
    return errs;
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      return;
    }
    const result = await register(form.username, form.email, form.password);
    if (result.success) {
      navigate("/");
    } else {
      setServerError(result.error);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-box">HN</div>
          <span className="auth-logo-text">
            Hacker<span>Feed</span>
          </span>
        </div>

        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Join to bookmark and track your favourite stories</p>

        {serverError && <div className="alert alert-error">{serverError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              name="username"
              className={`form-input${fieldErrors.username ? " error" : ""}`}
              placeholder="yourname"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
              required
            />
            {fieldErrors.username && (
              <p className="form-error">{fieldErrors.username}</p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              className={`form-input${fieldErrors.email ? " error" : ""}`}
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
            {fieldErrors.email && (
              <p className="form-error">{fieldErrors.email}</p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              className={`form-input${fieldErrors.password ? " error" : ""}`}
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
            {fieldErrors.password && (
              <p className="form-error">{fieldErrors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary auth-submit"
            disabled={loading}
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
