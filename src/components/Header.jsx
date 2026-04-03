import { FiSearch, FiMaximize, FiMinimize } from "react-icons/fi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUser, faComment } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Header.css";

const Header = ({ toggleSidebar, handleLogout }) => {
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-btn" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>

      <div className="header-right">
        <div
          className="header-icon fullscreen-btn"
          onClick={toggleFullscreen}
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? <FiMinimize /> : <FiMaximize />}
        </div>

        <div className="search">
          <input type="text" placeholder="Search" />
          <FiSearch />
        </div>

        <FontAwesomeIcon
          icon={faComment}
          className="header-icon"
          onClick={() => navigate("/chat")}
        />

        <FontAwesomeIcon
          icon={faUser}
          className="header-icon user-icon"
          onClick={() => navigate("/profile")}
        />

        {/* ✅ Logout button FIXED */}
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 15px",
            background: "red",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;