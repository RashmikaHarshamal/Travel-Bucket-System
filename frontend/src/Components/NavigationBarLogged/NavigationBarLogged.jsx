import React from "react";
import { Link } from "react-router-dom";
import "./NavigationBarLogged.css";

const Navbar = () => (
  <nav className="navbar">
    <h2 className="logo">🌍 Travel Bucket</h2>
    <ul className="nav-links">
      <li><Link to="/">Home</Link></li>
      <li><Link to="/dashboard">Dashboard</Link></li>
      <li><Link to="/bucket-list">Bucket List</Link></li>
      <li><Link to="/map">Map</Link></li>
      <li><Link to="/inspiration">Inspiration</Link></li>
      <li><Link to="/journal">Journal</Link></li>
      <li><Link to="/planner">Planner</Link></li>
      <li><Link to="/about">About</Link></li>
    </ul>
  </nav>
);

export default Navbar;
