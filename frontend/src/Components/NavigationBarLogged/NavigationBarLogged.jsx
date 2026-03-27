import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./NavigationBarLogged.css";

const NAV_LINKS = [
  // { to: "/",           label: "Home",        icon: "🏠" },
  { to: "/dashboard",  label: "Dashboard",   icon: "📊" },
  { to: "/bucket-list",label: "Bucket List", icon: "🗂️" },
  { to: "/map",        label: "Map",         icon: "🗺️" },
  { to: "/inspiration",label: "Inspiration", icon: "✨" },
  { to: "/journal",    label: "Journal",     icon: "📝" },
  { to: "/planner",    label: "Planner",     icon: "📅" },
  { to: "/about",      label: "About",       icon: "💡" },
];

const Navbar = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      {/* animated mesh bg */}
      <div className="navbar__mesh" aria-hidden="true" />

      {/* logo */}
      <Link to="/" className="navbar__logo">
        <span className="navbar__logo-icon">🌍</span>
        <span className="navbar__logo-text">Travel Bucket</span>
      </Link>

      {/* desktop links */}
      <ul className="navbar__links">
        {NAV_LINKS.map(({ to, label, icon }) => (
          <li key={to}>
            <Link
              to={to}
              className={`navbar__link${location.pathname === to ? " navbar__link--active" : ""}`}
            >
              <span className="navbar__link-icon">{icon}</span>
              <span>{label}</span>
            </Link>
          </li>
        ))}
      </ul>

      {/* logout + burger */}
      <div className="navbar__actions">
        <Link to="/" className="navbar__logout">
          <span>Logout</span>
          <span>→</span>
        </Link>
        <button
          className="navbar__burger"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span className={`burger-bar ${menuOpen ? "open" : ""}`} />
          <span className={`burger-bar ${menuOpen ? "open" : ""}`} />
          <span className={`burger-bar ${menuOpen ? "open" : ""}`} />
        </button>
      </div>

      {/* mobile drawer */}
      <div className={`navbar__drawer ${menuOpen ? "navbar__drawer--open" : ""}`}>
        <ul className="navbar__drawer-links">
          {NAV_LINKS.map(({ to, label, icon }) => (
            <li key={to}>
              <Link
                to={to}
                className={`navbar__drawer-link${location.pathname === to ? " navbar__drawer-link--active" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </Link>
            </li>
          ))}
          <li>
            <Link to="/" className="navbar__drawer-logout" onClick={() => setMenuOpen(false)}>
              → Logout
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;