import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "../utils/toast";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const isFormValid = email.trim() !== "" && password.trim() !== "";

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const adminUsername = "admin";
    const adminPassword = "admin123";

    setLoading(true);

    // Small delay so the button state is visible before redirect
    setTimeout(() => {
      if (email === adminUsername && password === adminPassword) {
        localStorage.setItem("adminAuth", "true");

        toast.success("Welcome back, Admin!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
        });

        setTimeout(() => navigate("/admin"), 1500);

      } else {
        toast.error("Invalid username or password.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        setLoading(false);
      }
    }, 600);
  };

  return (
    <>
      <Header />

      <div className="login-page">

        {/* Decorative background blobs */}
        <span className="login-blob login-blob--1" aria-hidden="true" />
        <span className="login-blob login-blob--2" aria-hidden="true" />

        <div className="login-card">

          {/* Brand mark */}
          <div className="login-brand">
            <span className="login-brand-dot" />
            <span className="login-brand-name">Admin Panel</span>
          </div>

          <h1 className="login-title">Welcome back</h1>
          <p className="login-subtitle">Sign in to continue to your dashboard</p>

          <form onSubmit={handleLogin} className="login-form" noValidate>

            <div className="input-group">
              <label htmlFor="login-username">Username</label>
              <div className="input-wrap">
                <span className="input-icon">
                  {/* person icon */}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  id="login-username"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter username"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="login-password">Password</label>
              <div className="input-wrap">
                <span className="input-icon">
                  {/* lock icon */}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className={`login-page-btn${loading ? " loading" : ""}`}
              disabled={loading || !isFormValid}
            >
              {loading ? (
                <span className="btn-spinner" aria-label="Signing in…" />
              ) : (
                "Sign In"
              )}
            </button>

          </form>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Login;