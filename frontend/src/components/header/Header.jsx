import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from '../../assets/logo.jpg';
import './Header.css';
import { UserData } from "../../context/UserContext";

const Header = ({ isAuth }) => {
  const { user } = UserData();
  const isAdmin = user && user.role === "admin";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const location = useLocation();

  // Close mobile menu whenever route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsHidden(false);
  }, [location.pathname]);

  // Handle scroll: slowly shrink navbar then close/hide on scroll down, restore on scroll up
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          // If mobile menu is open, close it as soon as user starts scrolling
          if (isMobileMenuOpen && Math.abs(currentScrollY - lastScrollY) > 10) {
            setIsMobileMenuOpen(false);
          }

          // Slowly small (compact mode) after scrolling past 30px
          setIsScrolled(currentScrollY > 30);

          // Close/hide when scrolling down past 160px with deliberate scroll
          // Show immediately when scrolling up or near top (<= 100px)
          const delta = currentScrollY - lastScrollY;
          if (currentScrollY > 160 && delta > 12) {
            setIsHidden(true); // scrolling down -> hide
          } else if (delta < -8 || currentScrollY <= 100) {
            setIsHidden(false); // scrolling up or at top -> show
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <div className="hdr-wrapper">
      <header className={`hdr-main ${isScrolled ? "hdr-scrolled" : ""} ${isHidden && !isMobileMenuOpen ? "hdr-hidden" : ""}`}>
        <div className="hdr-container">
          {/* Logo and Brand Name */}
          <Link to="/" className="hdr-logo-link" onClick={() => setIsMobileMenuOpen(false)}>
            <img src={logo} alt="Samarpan Math Academy Logo" className="hdr-logo-img" />
            <span className="hdr-brand-name">Samarpan Math Academy</span>
          </Link>

        {/* Navigation Links */}
        <nav className="hdr-nav">
          <Link to="/" className="hdr-link">Home</Link>
          <Link to="/about" className="hdr-link">About</Link>
          
          {/* Hide Courses and AI Tools from Admin, show them to users/guests */}
          {!isAdmin && (
            <>
              <Link to="/courses" className="hdr-link">Courses</Link>
              <Link to="/ai-tools" className="hdr-link">
                AI Tools
                <span className="hdr-ai-badge">✨ New</span>
              </Link>
            </>
          )}

          {isAuth ? (
            <>
              {isAdmin && (
                <Link to="/admin/dashboard" className="hdr-link">Admin Panel</Link>
              )}
              <Link to="/account" className="hdr-link">Account</Link>
            </>
          ) : (
            <Link to="/login" className="hdr-btn-login">Login</Link>
          )}
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          type="button"
          className={`hdr-mobile-btn ${isMobileMenuOpen ? "active" : ""}`}
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? (
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          ) : (
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`hdr-mobile-menu ${isMobileMenuOpen ? "open" : ""}`}>
        <nav className="hdr-mobile-nav">
          <Link to="/" className="hdr-mobile-link" onClick={() => setIsMobileMenuOpen(false)}>
            Home
          </Link>
          <Link to="/about" className="hdr-mobile-link" onClick={() => setIsMobileMenuOpen(false)}>
            About
          </Link>
          
          {!isAdmin && (
            <>
              <Link to="/courses" className="hdr-mobile-link" onClick={() => setIsMobileMenuOpen(false)}>
                Courses
              </Link>
              <Link to="/ai-tools" className="hdr-mobile-link" onClick={() => setIsMobileMenuOpen(false)}>
                <span>AI Tools</span>
                <span className="hdr-ai-badge">✨ New</span>
              </Link>
            </>
          )}

          {isAuth ? (
            <>
              {isAdmin && (
                <Link to="/admin/dashboard" className="hdr-mobile-link" onClick={() => setIsMobileMenuOpen(false)}>
                  Admin Panel
                </Link>
              )}
              <Link to="/account" className="hdr-mobile-link" onClick={() => setIsMobileMenuOpen(false)}>
                Account
              </Link>
            </>
          ) : (
            <Link to="/login" className="hdr-mobile-btn-login" onClick={() => setIsMobileMenuOpen(false)}>
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  </div>
  );
};

export default Header;
