import React, { useState } from "react";
import axios from "axios";
import "../assets/styles/style.css";
import logo from "../assets/img/logo.png";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post("https://student.nikeeworld.online/login", {
        email,
        password,
      });

      if (res.data.success) {
        setSuccess(res.data.message);

        // ✅ SAVE USER
        localStorage.setItem("user", JSON.stringify(res.data.user));

        // ✅ GO DASHBOARD
        navigate("/dashboard");
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <div className="logo">
          <img src={logo} alt="Logo" className="logo-image" />
        </div>
<h2>Welcome to 
Nikee Student Link</h2>
<p>Please sign in to access your student work dashboard and efficiently manage your assigned activities.</p>
      

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit} className="form-content">

          <div className="form-group full">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="username@gmail.com"
            />
          </div>

          <div className="form-group full">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>

          <button type="submit" className="login-btn">
            Sign In
          </button>

        </form>

      </div>
    </div>
  );
};

export default Login;