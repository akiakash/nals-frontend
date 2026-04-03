import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom"; 
import Header from "./Header";
import Sidebar from "./Sidebar";
import "./Layout.css";

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  // ✅ sidebar toggle function
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // ✅ logout function
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className={`app-layout ${collapsed ? "collapsed" : ""}`}>
      
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} />

      {/* Main content */}
      <div className="main-area">

        <Header
          toggleSidebar={toggleSidebar}
          handleLogout={handleLogout}
        />

        <main className="content">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default Layout;