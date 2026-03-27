import React, { useState } from 'react';
import './createAccount.css';
import girlImage from './girl1.png';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../../config/api';

const FIELDS = [
  { name: 'username',        label: 'Username',         type: 'text',     icon: 'ri-user-3-line',       placeholder: 'Choose a username'      },
  { name: 'email',           label: 'Email',            type: 'email',    icon: 'ri-mail-line',          placeholder: 'your@email.com'         },
  { name: 'phoneNumber',     label: 'Phone Number',     type: 'tel',      icon: 'ri-phone-line',         placeholder: '+1 234 567 8900'        },
  { name: 'password',        label: 'Password',         type: 'password', icon: 'ri-lock-2-line',        placeholder: 'Create a password'      },
  { name: 'confirmPassword', label: 'Confirm Password', type: 'password', icon: 'ri-shield-check-line',  placeholder: 'Repeat your password'   },
];

export default function CreateAccount() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '', email: '', phoneNumber: '', password: '', confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setError('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const passwordsMatch =
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword;

  const passwordsMismatch =
    formData.confirmPassword.length > 0 &&
    formData.password !== formData.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordsMismatch) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await axios.post(`${API_BASE}/adduser`, {
        username:    formData.username,
        email:       formData.email,
        phoneNumber: formData.phoneNumber,
        password:    formData.password,
        role:        'user',
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1800);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Error creating account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* password confirmation field state */
  const confirmClass =
    passwordsMatch    ? 'input--ok'    :
    passwordsMismatch ? 'input--error' : '';

  return (
    <div className="signup-container">
      <div className="signup-box">

        {/* ── LEFT ── */}
        <div className="left-section">
          <img src={girlImage} alt="Traveller illustration" className="girl-image" />
        </div>

        {/* ── RIGHT ── */}
        <div className="right-section">
          <p className="signup-eyebrow">Join the adventure</p>

          <h1 className="signup-heading">
            <span className="grad">Sign Up</span>
          </h1>
          <p className="signup-sub">Create your free account and start chasing dreams.</p>

          {/* error banner */}
          {error && <div className="signup-error">⚠️ {error}</div>}

          {/* success flash */}
          {success && (
            <div className="signup-error" style={{
              background: 'rgba(163,230,53,.12)',
              borderColor: 'rgba(163,230,53,.35)',
              color: '#a3e635',
              marginBottom: '8px',
            }}>
              ✅ Account created! Redirecting to login…
            </div>
          )}

          <form className="signup-form" onSubmit={handleSubmit}>

            {/* row 1 — username + email */}
            <div className="field-row">
              {FIELDS.slice(0, 2).map(f => (
                <div className="field" key={f.name}>
                  <label htmlFor={f.name}>{f.label}</label>
                  <div className="input-wrap">
                    <input
                      id={f.name}
                      type={f.type}
                      name={f.name}
                      value={formData[f.name]}
                      onChange={handleChange}
                      placeholder={f.placeholder}
                      required
                      autoComplete={f.name}
                    />
                    <i className={`${f.icon} input-icon`} />
                  </div>
                </div>
              ))}
            </div>

            {/* row 2 — phone (full width) */}
            <div className="field">
              <label htmlFor="phoneNumber">{FIELDS[2].label}</label>
              <div className="input-wrap">
                <input
                  id="phoneNumber"
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder={FIELDS[2].placeholder}
                  required
                />
                <i className="ri-phone-line input-icon" />
              </div>
            </div>

            {/* row 3 — password + confirm */}
            <div className="field-row">
              <div className="field">
                <label htmlFor="password">Password</label>
                <div className="input-wrap">
                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    required
                    autoComplete="new-password"
                  />
                  <i className="ri-lock-2-line input-icon" />
                </div>
              </div>

              <div className="field">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-wrap">
                  <input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat your password"
                    required
                    autoComplete="new-password"
                    className={confirmClass}
                  />
                  <i className="ri-shield-check-line input-icon" />
                </div>
                {passwordsMatch    && <span className="field-hint field-hint--ok">✓ Passwords match</span>}
                {passwordsMismatch && <span className="field-hint field-hint--error">✗ Passwords don't match</span>}
              </div>
            </div>

            <button
              type="submit"
              className="btn-signup"
              disabled={loading || success}
            >
              {loading
                ? <><i className="ri-loader-4-line" style={{ animation: 'spin 1s linear infinite' }} /> Creating account…</>
                : <>Create Account <span style={{ fontSize: '1.1rem' }}>✦</span></>
              }
            </button>

          </form>

          <div className="signup-links">
            <p>Already have an account? <Link to="/login">Log in</Link></p>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}