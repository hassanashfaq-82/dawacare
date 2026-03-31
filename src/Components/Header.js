import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useSiteInfo, DEFAULT_SITE_INFO } from "../contexts/SiteInfoContext";

function Header() {
  const [mobileMenuActive, setMobileMenuActive] = useState(false);
  const { cart, setIsCartOpen } = useCart();
  const { siteInfo } = useSiteInfo();
  const logoURL = siteInfo?.logoURL || DEFAULT_SITE_INFO.logoURL;

  const toggleMobileMenu = () => {
    setMobileMenuActive(!mobileMenuActive);
    document.body.style.overflow = !mobileMenuActive ? "hidden" : "";
  };

  const closeMobileMenu = () => {
    setMobileMenuActive(false);
    document.body.style.overflow = "";
  };

  return (
    <>
      <header>
        <div className="header-container">
          {/* Logo */}
          <Link to="/" className="logo">
            <img src={logoURL} alt="Logo" />
          </Link>

          {/* Mobile Cart Button — visible only on mobile, before hamburger */}
          <button
            className="mobile-cart-btn"
            onClick={() => setIsCartOpen(true)}
            aria-label="Open cart"
          >
            <span className="cart-icon-wrap">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cart.length > 0 && (
                <span className="cart-badge">{cart.length}</span>
              )}
            </span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            className="mobile-menu-toggle"
            aria-label="Toggle menu"
            onClick={toggleMobileMenu}
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>

          <div className="menu">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/products">Products</Link>
          </div>

          {/* Search Bar */}
          <div className="search-bar">
            <div className="select-and-input">
              <select className="category-select">
                <option>All Categories</option>
                <option>Medicines</option>
                <option>Supplements</option>
                <option>Equipment</option>
              </select>
              <input
                type="text"
                className="search-input"
                placeholder="Search..."
              />
            </div>
            <button className="search-btn btn btn-danger">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>

          {/* Header Actions */}
          <div className="header-actions">
            {/* Location */}
            <div className="location">
              <span>
                <p>Select your location</p>
              </span>
              <select>
                <option>New York</option>
                <option>London</option>
                <option>Dubai</option>
              </select>
            </div>

            {/* Wishlist */}
            <a href="#" className="icon-link">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span>Wishlist</span>
            </a>

            {/* Cart */}
            <button
              className="icon-link cart-btn"
              onClick={() => setIsCartOpen(true)}
            >
              <span className="cart-icon-wrap">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {cart.length > 0 && (
                  <span className="cart-badge">{cart.length}</span>
                )}
              </span>
              <span>Cart</span>
            </button>
            {/* Login Button */}
            <Link to ="/login" className="login-btn btn btn-danger">Login</Link>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
   {/* Mobile Menu Overlay */}
<div
  className={`mobile-menu-overlay ${mobileMenuActive ? "active" : ""}`}
  id="mobileMenuOverlay"
  onClick={(e) =>
    e.target.id === "mobileMenuOverlay" && closeMobileMenu()
  }
>
  <div className="mobile-menu">
    {/* Close Button */}
    <button className="mobile-menu-close" onClick={closeMobileMenu}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>

    <br />

    {/* Mobile Menu Links */}
    <div className="mob-menu">
      <Link to="/" onClick={closeMobileMenu}>Home</Link>
      <Link to="/about" onClick={closeMobileMenu}>About</Link>
      <Link to="/products" onClick={closeMobileMenu}>Products</Link>
    </div>

    {/* Mobile Search */}
    <div className="mobile-search-section">
      <select className="mobile-category-select">
        <option>All Categories</option>
        <option>Medicines</option>
        <option>Supplements</option>
        <option>Equipment</option>
      </select>
      <input
        type="text"
        className="mobile-search-input"
        placeholder="Search..."
      />
      <button className="mobile-search-btn">Search</button>
    </div>

    {/* Mobile Location */}
    <div className="mobile-location">
      <label>Select your location</label>
      <select>
        <option>New York</option>
        <option>London</option>
        <option>Dubai</option>
      </select>
    </div>

    {/* Mobile Actions */}
    <div className="mobile-actions">
      <a href="#" className="mobile-action-link">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        Wishlist
      </a>

      <button
  className="mobile-action-link"
  onClick={() => {
    setIsCartOpen(true);      // Open cart
    setMobileMenuActive(false); // Close mobile menu
  }}
>
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
  Cart {cart.length > 0 && `(${cart.length})`}
</button>

      <button className="mobile-login-btn">Login</button>
    </div>
  </div>
</div>
      <br />
    </>
  );
}

export default Header;
