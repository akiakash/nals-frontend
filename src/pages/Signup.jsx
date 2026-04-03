import React, { useState } from "react";
import axios from "axios";
import "../assets/styles/style.css";
import logo from "../assets/img/logo.png";

const SignUp = () => {
  const [formData, setFormData] = useState({ firstname: "", lastname: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstname || !formData.lastname || !formData.email || !formData.password) {
      setError("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5050/signup", formData);
      if (res.data.success) {
        setSuccess(res.data.message);
        setFormData({ firstname: "", lastname: "", email: "", password: "" });
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="logo">
          <img src={logo} alt="Logo" className="logo-image" />
        </div>
        <h2>Sign Up</h2>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form className="form-content" onSubmit={handleSubmit}>
          <div className="form-group full">
            <label>First Name</label>
            <input id="firstname" type="text" placeholder="First Name" value={formData.firstname} onChange={handleChange} />
          </div>
          <div className="form-group full">
            <label>Last Name</label>
            <input id="lastname" type="text" placeholder="Last Name" value={formData.lastname} onChange={handleChange} />
          </div>
          <div className="form-group full">
            <label>Email</label>
            <input id="email" type="email" placeholder="username@gmail.com" value={formData.email} onChange={handleChange} />
          </div>
          <div className="form-group full">
            <label>Password</label>
            <input id="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} />
          </div>
          <button type="submit" className="submit-btn">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;