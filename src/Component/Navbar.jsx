import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const handleClick = (itemName) => {
    console.log(`${itemName} clicked`);
  };

  return (
    <nav className="navbar">
      {/* Left: Brand Icon & Logo */}
      <div className="nav-brand" onClick={() => handleClick("Brand / Logo")}>
        <div className="brand-icon">
          <img src="/assets/images/logo.jpeg" alt="Brand Logo"  />
          {/* <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg> */}
        </div>
        <span className="brand-name">WeELEKTRONIC</span>
      </div>

      {/* Right: Navigation Links & Login */}
      <div className="nav-links">
         <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "nav-items active" : "nav-items"
          }
        >
          Home
        </NavLink>
        
       
       <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive ? "nav-items active" : "nav-items"
          }
        >
          Settings
        </NavLink>

       
        <button
          className="nav-item"
          onClick={() => handleClick("About")}
        >
          About
        </button>
        <button
          className="login-button"
          onClick={() => handleClick("Login")}
        >
          Login
        </button>
      </div>
    </nav>
  );
};

export default Navbar;