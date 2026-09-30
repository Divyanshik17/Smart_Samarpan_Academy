import React from "react";
import { Link, useLocation } from "react-router-dom";
import { AiFillHome, AiOutlineLogout } from "react-icons/ai";
import { FaBook, FaUserAlt, FaPlus } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";
import { UserData } from "../../context/UserContext";

const Sidebar = ({ isCollapsed, toggleSidebar, isMobileOpen, closeMobileSidebar }) => {
  const { user } = UserData();
  const location = useLocation();

  const navLinks = [
    { to: "/admin/dashboard", icon: AiFillHome, text: "Dashboard", role: "all" },
    { to: "/admin/course", icon: FaBook, text: "Manage Courses", role: "all" },
    { to: "/admin/course/add", icon: FaPlus, text: "Add Course", role: "all" },
    { to: "/admin/users", icon: FaUserAlt, text: "Manage Users", role: "all" },
  ];

  return (
    <aside className={`adm-sidebar ${isCollapsed ? "collapsed" : ""} ${isMobileOpen ? "mobile-open" : ""}`}>
      {/* Brand & Toggle Header */}
      <div className="adm-sidebar-header">
        <div className="adm-sidebar-brand" title="Samarpan Admin">
          {isCollapsed ? (
            <span className="adm-brand-short">SA</span>
          ) : (
            <span className="adm-brand-full">Samarpan Admin</span>
          )}
        </div>

        {/* Desktop Collapse/Expand Toggle Button */}
        <button
          type="button"
          className="adm-collapse-btn"
          onClick={toggleSidebar}
          title={isCollapsed ? "Expand sidebar" : "Minimize sidebar"}
          aria-label={isCollapsed ? "Expand sidebar" : "Minimize sidebar"}
        >
          {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </button>

        {/* Mobile Close Button */}
        <button
          type="button"
          className="adm-mobile-close-btn"
          onClick={closeMobileSidebar}
          aria-label="Close sidebar"
        >
          <FiX />
        </button>
      </div>

      {/* Nav Links */}
      <ul className="adm-nav-list">
        {navLinks.map((link, index) => {
          if (link.role === "superadmin" && user && user.mainrole !== "superadmin") {
            return null;
          }
          const isActive = location.pathname === link.to;
          return (
            <li key={index}>
              <Link
                to={link.to}
                className={`adm-nav-link ${isActive ? 'active' : ''}`}
                title={isCollapsed ? link.text : undefined}
                onClick={closeMobileSidebar}
              >
                <link.icon className="adm-nav-icon" />
                {!isCollapsed && <span className="adm-nav-text">{link.text}</span>}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Footer / Logout */}
      <div className="adm-sidebar-footer">
        <Link
          to="/account"
          className="adm-nav-link logout"
          title={isCollapsed ? "Logout" : undefined}
          onClick={closeMobileSidebar}
        >
          <AiOutlineLogout className="adm-nav-icon" />
          {!isCollapsed && <span className="adm-nav-text">Logout</span>}
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;