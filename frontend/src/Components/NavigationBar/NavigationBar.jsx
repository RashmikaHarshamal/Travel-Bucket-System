import React, { useRef, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./NavigationBar.css";

const NAV_LINKS = [
  { label: "Home",        path: "/" },
  { label: "Explore",     path: "/explore" },
  { label: "Bucket Lists",path: "/bucketlists" },
  { label: "Community",   path: "/community" },
  { label: "About",       path: "/about" },
];

function NavigationBar() {
  const navbar   = useRef();
  const menu     = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  /* scroll → frosted glass */
  useEffect(() => {
    const onScroll = () => {
      navbar.current?.classList.toggle("navbarScroll", window.scrollY > 60);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* close mobile menu on route change */
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const toggleMenu = () => setMenuOpen(prev => !prev);

  return (
    <nav className="nav_wrapper" ref={navbar}>

      {/* ── LOGO ── */}
      <div className="logo" onClick={() => navigate("/")}>
        <span className="logo__accent">Travel</span>&nbsp;Bucket
        {/* <span className="logo__dot" /> */}
      </div>

      {/* ── NAV LINKS ──
      <ul ref={menu} className={menuOpen ? "shownNav" : ""}>
        {NAV_LINKS.map(({ label, path }) => (
          <li
            key={path}
            className={location.pathname === path ? "active" : ""}
            onClick={() => navigate(path)}
          >
            {label}
          </li>
        ))}
      </ul> */}

      {/* ── BUTTONS + HAMBURGER ──
      <div className="Nav_btns">
        <button
          className="nav-btn-login"
          onClick={() => navigate("/Login")}
        >
          Log In
        </button>
        <button
          className="nav-btn-signup"
          onClick={() => navigate("/Signup")}
        >
          Sign Up ✦
        </button>

        <button id="bars" onClick={toggleMenu} aria-label="Toggle menu">
          {menuOpen
            ? <i className="ri-close-line" />
            : <i className="ri-menu-4-line" />
          }
        </button>
      </div> */}

    </nav>
  );
}

export default NavigationBar;