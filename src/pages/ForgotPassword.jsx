import React from "react";
import { Link } from "react-router-dom";
import "../assets/styles/style.css";
import logo from "../assets/img/logo.png";

const ForgotPassword = () => {
  return (
    <div className="frogotpw-container">
      <div className="frogotpw-card">

        <div className="logo">
          <img src={logo} alt="Logo" className="logo-image" />
        </div>

        <h2>Forgot Password</h2>
        <p className="info-text">Enter your email to reset your password</p>

        <form className="form-content">

          <div className="form-group full">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="username@gmail.com"
            />
          </div>

          <div className="form-group full">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" placeholder="Password" />
          </div>

          <div className="form-group full">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input id="confirmPassword" type="password" placeholder="Confirm Password" />
          </div>

          <button type="submit" className="login-btn">
            Send Reset Code
          </button>

        </form>

        <p className="register">
          Remember your password? <Link to="/login">Back to Login</Link>
        </p>

      </div>
    </div>
  );
};

export default ForgotPassword;