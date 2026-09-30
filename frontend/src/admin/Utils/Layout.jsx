import React, { useState } from "react";
import Sidebar from "./Sidebar";
import "./Admin.css";
import { FiMenu } from "react-icons/fi";

const Layout = ({ children }) => {
  // Read initial collapsed state from localStorage for desktop
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem("adm_sidebar_collapsed") === "true";
  });

  // Mobile drawer open state
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("adm_sidebar_collapsed", next);
      return next;
    });
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen((prev) => !prev);
  };

  const closeMobileSidebar = () => {
    setIsMobileOpen(false);
  };

  return (
    <div className={`adm-layout ${isCollapsed ? "sidebar-collapsed" : ""}`}>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div className="adm-mobile-backdrop" onClick={closeMobileSidebar} />
      )}

      {/* Admin Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
        isMobileOpen={isMobileOpen}
        closeMobileSidebar={closeMobileSidebar}
      />

      {/* Main Content Area */}
      <div className="adm-content">
        {/* Mobile top bar toggle button */}
        <div className="adm-mobile-topbar">
          <button
            type="button"
            className="adm-mobile-toggle-btn"
            onClick={toggleMobileSidebar}
            aria-label="Toggle admin sidebar"
          >
            <FiMenu />
            <span>Admin Menu</span>
          </button>
        </div>

        {children}
      </div>
    </div>
  );
};

export default Layout;