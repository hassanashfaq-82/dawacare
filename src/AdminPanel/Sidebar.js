// src/adminpanel/Sidebar.js
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./AdminPanel.css";
import { FaBars, FaTimes } from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar when route changes (for mobile)
  useEffect(() => {
    if (window.innerWidth <= 768) {
      setIsOpen(false);
    }
  }, [location]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (window.innerWidth <= 768 &&
        isOpen &&
        !event.target.closest('.admin-sidebar') &&
        !event.target.closest('.sidebar-toggle')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleLogout = () => {
    // remove login state
    localStorage.removeItem("adminAuth");
    // redirect to login page
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Hamburger Menu Button */}
      <div className="sidebar-toggle" onClick={toggleSidebar}>
        {isOpen ? <FaTimes size={25} /> : <FaBars size={25} />}
      </div>

      {/* Overlay for mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}

      {/* Sidebar */}
      <div className={`admin-sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <Link to="/" style={{ textDecoration: "none", color: "white" }}>
              <h2 className="sidebar-title">
                Dawa<span>Care</span>
              </h2>
            </Link>
          </div>
          <p className="admin-badge">Admin Panel</p>
        </div>

        <nav className="sidebar-nav">
          <ul className="sidebar-menu">
            <li className={location.pathname === "/admin" ? "active" : ""}>
              <Link to="/admin">
                <span className="menu-text">Dashboard</span>
              </Link>
            </li>

            <li className={location.pathname === "/admin/orders" ? "active" : ""}>
              <Link to="/admin/orders">
                <span className="menu-text">Orders</span>
              </Link>
            </li>

            <li className={location.pathname === "/admin/AddProduct" ? "active" : ""}>
              <Link to="/admin/AddProduct">
                <span className="menu-text">Add Product</span>
              </Link>
            </li>

            <li className={location.pathname === "/admin/UploadProducts" ? "active" : ""}>
              <Link to="/admin/UploadProducts">
                <span className="menu-text">Products List</span>
              </Link>
            </li>

            <li className={location.pathname === "/admin/ManageSale" ? "active" : ""}>
              <Link to="/admin/ManageSale">
                <span className="menu-text">Manage Sale</span>
              </Link>
            </li>

            <li className={location.pathname === "/admin/BusinessInfo" ? "active" : ""}>
              <Link to="/admin/BusinessInfo">
                <span className="menu-text">Business Info</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;