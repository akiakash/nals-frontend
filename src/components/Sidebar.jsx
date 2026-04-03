import { useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiUsers, FiLogOut, FiChevronDown, FiGitCommit, FiLogIn } from "react-icons/fi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGauge,
  faBuildingColumns,
  faGraduationCap,
  faFileContract,
  faBookOpen,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/img/logo.png";
import "./Sidebar.css";

const Sidebar = ({ collapsed }) => {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null);
  const [active, setActive] = useState("");
  const [hoverMenu, setHoverMenu] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ top: 0, left: 0 });

  const menuRefs = useRef({});

  const toggleMenu = (menu) =>
    setOpenMenu(openMenu === menu ? null : menu);

  
  const submenuLinks = {
    Dashboard: "/dashboard",
    "Add Course": "/addcourse",
    "Add College": "/addcollage",
    "Add Agreement": "/addagreement",
    "Add Enrolment Details": "/addenrolment",
    "Enrolment Checklist": "/enrolmentchecklist",
    "Add Flyer": "/addflyer",
    "View Course": "/courses",
    "View Agreement": "/agreement",
    "View Enrolment": "/enrolment",
    "View Flyer": "/flyer",
    Login:"/login",
    Signup: "/Signup",
    ForgotPassword:"/forgotpassword",    
    };

 
  const SubItem = ({ label }) => (
    <div
      className={`submenu-item ${active === label ? "active" : ""}`}
      onClick={() => {
        setActive(label);
        navigate(submenuLinks[label]);
      }}
    >
      <FiGitCommit className="dot-icon" />
      <span>{label}</span>
    </div>
  );

  
  const menus = [
    {
      title: "DASHBOARD & APPS",
      label: "Dashboard",
      icon: <FontAwesomeIcon icon={faGauge} />,
      key: "dashboard",
      submenu: [],
    },
    {
      label: "Course",
      icon: <FontAwesomeIcon icon={faGraduationCap} />,
      key: "course",
      submenu: ["Add Course", "View Course"],
    },
    {
      label: "College",
      icon: <FontAwesomeIcon icon={faBuildingColumns} />,
      key: "college",
      submenu: ["Add College"],
    },
    
    {
      label: "Agreement",
      icon: <FontAwesomeIcon icon={faFileContract} />,
      key: "agreement",
      submenu: ["Add Agreement", "View Agreement"],
    },
    {
      title: "ENROLMENT",
      label: "Student Enrolment",
      icon: <FiUsers />,
      key: "enrolment",
      submenu: [
        "Add Enrolment Details",
        "View Enrolment",
        "Enrolment Checklist",
      ],
    },
    {
      title: "FLYERS",
      label: "Flyer",
      icon: <FontAwesomeIcon icon={faBookOpen} />,
      key: "flyer",
      submenu: ["Add Flyer", "View Flyer"],
    },
  ];

  const handleMouseEnter = (key) => {
    if (!collapsed) return;
    const rect = menuRefs.current[key]?.getBoundingClientRect();
    if (rect) setHoverPosition({ top: rect.top, left: rect.right });
    setHoverMenu(key);
  };

  const handleMouseLeave = () => setHoverMenu(null);

  return (
    <>
      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <img src={logo} alt="Logo" className="logo-image" />
        </div>

        {menus.map((menu) => (
          <div key={menu.key} className="menu-wrapper">
            {!collapsed && menu.title && (
              <div className="sidebar-title">{menu.title}</div>
            )}

           
            {menu.key === "dashboard" ? (
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `menu-item ${isActive ? "active" : ""}`
                }
              >
                {menu.icon}
                {!collapsed && <span>{menu.label}</span>}
              </NavLink>
            ) : (
              <div
                ref={(el) => (menuRefs.current[menu.key] = el)}
                className={`menu-item ${
                  openMenu === menu.key ? "open" : ""
                } ${menu.key === "logout" ? "logout" : ""}`}
                onClick={() =>
                  menu.submenu.length
                    ? toggleMenu(menu.key)
                    : navigate(submenuLinks[menu.label])
                }
                onMouseEnter={() => handleMouseEnter(menu.key)}
                onMouseLeave={handleMouseLeave}
              >
                {menu.icon}
                {!collapsed && <span>{menu.label}</span>}
                {!collapsed && menu.submenu.length > 0 && (
                  <FiChevronDown className="arrow" />
                )}
              </div>
            )}

         
            {openMenu === menu.key && !collapsed && menu.submenu.length > 0 && (
              <div className="submenu">
                {menu.submenu.map((sub) => (
                  <SubItem key={sub} label={sub} />
                ))}
              </div>
            )}
          </div>
        ))}
      </aside>

      
      {collapsed &&
        hoverMenu &&
        menus.find((m) => m.key === hoverMenu)?.submenu.length >
          0 && (
          <div
            className="submenu-hover-panel"
            style={{
              top: hoverPosition.top,
              left: hoverPosition.left,
              position: "fixed",
            }}
            onMouseEnter={() => setHoverMenu(hoverMenu)}
            onMouseLeave={handleMouseLeave}
          >
            {menus
              .find((m) => m.key === hoverMenu)
              .submenu.map((sub) => (
                <SubItem key={sub} label={sub} />
              ))}
          </div>
        )}
    </>
  );
};

export default Sidebar;



