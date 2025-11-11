import React from "react";
import "./Footer.css";
import { FaInstagram, FaDribbble, FaTwitter, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column">
          <h2 className="logo">
            <span className="logo-highlight">Career</span> Map
          </h2>
          <p className="tagline">Where growth beging</p>

          <p className="label"><strong>Address :</strong></p>
          <p>26/112, Kumudugama<br />dadayamthalawa<br />SriLanka</p>

          <p className="label"><strong>Contact Details</strong></p>
          <p>0714191696<br />0761235106<br />careermap@supports.com</p>
        </div>

        <div className="footer-column">
          <p className="label green"><strong>Services :</strong></p>
          <p>Guidance</p>
          <p>Assessment</p>
          <p>Tracking</p>
          <p>Recommendations</p>
          <p>Roadmap Builder</p>
        </div>

        <div className="footer-column">
          <p className="label green"><strong>Courses</strong></p>
          <p>DSA</p>
          <p>OOP</p>
          <p>DBMS</p>
          <p>CN</p>
          <p>OS</p>
        </div>

        <div className="footer-column">
          <p className="label green"><strong>Legal</strong></p>
          <p>Contact</p>
          <p>Privacy Policy</p>
          <p>Terms & Condition</p>

          <div className="social-icons">
            <FaInstagram />
            <FaDribbble />
            <FaTwitter />
            <FaYoutube />
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © 2025, CareerMap.inc All rights reserved
      </div>
    </footer>
  );
};

export default Footer;