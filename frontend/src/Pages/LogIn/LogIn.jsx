import React, { useState } from 'react';
import './LogIn.css';
import girlImage from './girl.png';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LogIn() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/v1/login", {
        username,
        password
      });
      if (response.data) {
        // alert("Login successful!");
        navigate("/dashboard");
      } else {
        alert("Invalid credentials");
      }
    } catch (err) {
      alert("Error logging in");
    }
  };

  // const Navigate = useNavigate();

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="left-section">
          <img src={girlImage} alt="Student" className="girl-image" />
        </div>
        <div className="right-section">
          <h2>
            <span className="dark">Log</span>
            <span className="green">In</span>
          </h2>

          <form onSubmit={handleLogin}>
            <label>User Name<br /></label>
            <input 
              type="text" 
              placeholder="Enter User ID" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <label>Password<br /></label>
            <input 
              type="password" 
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit">Log In</button>
          </form>

          <div className="links">
            <a href="#">Forgot Your Password?</a>
            <br />
            <span>If you haven't an account, <Link to="/createaccount">Click here</Link></span>
          </div>
        </div>
      </div>
    </div>
  );
}
