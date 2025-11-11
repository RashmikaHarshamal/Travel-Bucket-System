import React, { useState } from 'react';
import './createAccount.css';
import girlImage from './girl.png';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // import axios

export default function CreateAccount() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });

  // Update form state
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/v1/adduser', {
        username: formData.username,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        role : "user"
      });
      alert("Account created successfully!");
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert("Error creating account!");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <div className="left-section">
          <img src={girlImage} alt="Student" className="girl-image" />
        </div>
        <div className="right-section">
          <h2>
            <span className="dark">Sign</span>
            <span className="green">Up</span>
          </h2>

          <form onSubmit={handleSubmit}>
            <label>User Name</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Enter User Name" required />

            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter Email" required />

            <label>Phone No.</label>
            <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Enter Phone Number" required />

            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter Password" required />

            <label>Conf. Password</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" required />

            <button type="submit">SignUp</button>
          </form>

          <div className="links">
            <span>
              Already have an account? <Link to="/login">Click here</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
