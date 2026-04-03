import React from "react";
import "../assets/styles/style.css";
import dashboard from "../assets/img/dashboard.svg";
import { Link, useNavigate } from "react-router-dom";

// Flyers
import Flyer1 from "../assets/img/flyer/flyer1.jpeg";
import Flyer2 from "../assets/img/flyer/flyer2.jpeg";
import Flyer3 from "../assets/img/flyer/flyer3.jpeg";
import Flyer4 from "../assets/img/flyer/flyer4.jpeg";
import Flyer5 from "../assets/img/flyer/flyer5.jpeg";
import Flyer6 from "../assets/img/flyer/Flyer6.jpeg";
import Flyer7 from "../assets/img/flyer/Flyer7.jpeg";
import Flyer8 from "../assets/img/flyer/Flyer8.jpeg";
import Flyer9 from "../assets/img/flyer/Flyer9.jpeg";
import Flyer10 from "../assets/img/flyer/Flyer10.jpeg";
import Flyer11 from "../assets/img/flyer/Flyer11.jpeg";
import Flyer12 from "../assets/img/flyer/Flyer12.jpeg";
import Flyer13 from "../assets/img/flyer/Flyer13.jpeg";
import Flyer14 from "../assets/img/flyer/Flyer14.jpeg";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // ✅ logged user
  const user = JSON.parse(localStorage.getItem("user"));

  // ❌ if not logged → send to login
  if (!user) {
    navigate("/login");
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const flyers = [
    { id: 1, img: Flyer1, title: "Diploma of Building and Construction (Building)" },
    { id: 2, img: Flyer2, title: "Certificate iii in Carpentry (Special offer)" },
    { id: 3, img: Flyer3, title: "Bachelour of business" },
    { id: 4, img: Flyer4, title: "Bachelor of Nursing QUT" },
    { id: 5, img: Flyer5, title: "Special Promotion" },
    { id: 6, img: Flyer6, title: "Bachelor of Nursing Griffith University" },
    { id: 7, img: Flyer7, title: "Certificate iii in Carpentry" },
    { id: 8, img: Flyer8, title: "Bricklaying Certificate iii" },
    { id: 9, img: Flyer9, title: "Cabinet making Certificate iii" },
    { id: 10, img: Flyer10, title: "Save on Your Studies" },
    { id: 11, img: Flyer11, title: "Solid Plastering Certificate iii" },
    { id: 12, img: Flyer12, title: "Diploma Building Construction" },
    { id: 13, img: Flyer13, title: "Skilled Migration Flyer" },
    { id: 14, img: Flyer14, title: "Visa Support Flyer" },
  ];

  return (
    <div className="dashboard-container">

    

      {/* ===== Welcome Banner ===== */}
      <div className="welcome-banner">
        <div className="welcome-image">
          <img src={dashboard} alt="Welcome" />
        </div>

        <div className="welcome-content">
          <h2> Hellow 👋 {user?.fullName || user?.email}, Welcome Back! </h2>
          <p>
            Trusted migration & business partner helping you grow globally.
          </p>
        </div>
      </div>

      {/* ===== QUICK ACTIONS ===== */}
      <div className="quick-actions">
        <Link to="/AddAgreement" className="qa-btn">Create Agreement</Link>
        <Link to="/AddCollage" className="qa-btn">Add Collage</Link>
        <Link to="/AddCourse" className="qa-btn">Add Course</Link>
        <Link to="/Reports" className="qa-btn">View Reports</Link>
      </div>

      {/* ===== FLYERS ===== */}
      <div className="flyer-section">
        <h2>Our Latest Flyers</h2>

        <div className="flyer-grid">
          {flyers.map((flyer) => (
            <div className="flyer-card" key={flyer.id}>
              <img src={flyer.img} alt={flyer.title} />
              <div className="flyer-overlay">
                <h4>{flyer.title}</h4>
                <button
                  className="view-btn"
                  onClick={() => window.open(flyer.img, "_blank")}
                >
                  View Full
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;