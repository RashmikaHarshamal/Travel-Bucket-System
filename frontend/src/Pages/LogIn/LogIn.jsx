import React, { useState } from 'react';
import './LogIn.css';
import girlImage from './girl.png';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../../config/api';

export default function LogIn() {
  const navigate  = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/login`, { username, password });
      if (response.data) {
        navigate("/dashboard");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      const status  = err?.response?.status;
      const message = err?.response?.data?.message;
      if (status === 401) {
        setError("Invalid username or password.");
      } else {
        setError(message || "Something went wrong. Please try again.");
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">

        {/* ── LEFT — illustration ── */}
        <div className="left-section">
          <img src={girlImage} alt="Traveller illustration" className="girl-image" />
        </div>

        {/* ── RIGHT — form ── */}
        <div className="right-section">
          <p className="login-eyebrow">Welcome back</p>

          <h1 className="login-heading">
            <span className="grad">Log In</span>
          </h1>
          <p className="login-sub">Pick up right where you left off.</p>

          {/* error banner */}
          {error && (
            <div className="login-error" style={{
              background: "rgba(255,45,120,.12)",
              border: "1px solid rgba(255,45,120,.35)",
              borderRadius: "10px",
              padding: "12px 16px",
              fontSize: ".85rem",
              color: "#ff6fa3",
              marginBottom: "16px",
            }}>
              ⚠️ {error}
            </div>
          )}

          <form className="login-form" onSubmit={handleLogin}>

            <div className="field">
              <label htmlFor="login-username">Username</label>
              <div className="input-wrap">
                <input
                  id="login-username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                />
                <i className="ri-user-3-line input-icon" />
              </div>
            </div>

            <div className="field">
              <label htmlFor="login-password">Password</label>
              <div className="input-wrap">
                <input
                  id="login-password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <i className="ri-lock-2-line input-icon" />
              </div>
            </div>

            <button
              type="submit"
              className="btn-login"
              disabled={loading}
            >
              {loading
                ? <><i className="ri-loader-4-line" style={{ animation: "spin 1s linear infinite" }} /> Signing in…</>
                : <> Log In <span style={{ fontSize: "1.1rem" }}>→</span></>
              }
            </button>

          </form>

          <div className="login-links">
            <a href="#">Forgot your password?</a>
            <div className="login-divider" />
            <p className="signup-line">
              Don't have an account?
              <Link to="/createaccount"> Sign up free</Link>
            </p>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}