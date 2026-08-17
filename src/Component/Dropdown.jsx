import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import "../styles/Dropdown.css";

const Dropdown = ({
  label,
  options = [],
  value,
  onChange,
  disabled = false,
  size = "md",
  variant = "primary",
  className = "",
    placeholder = "Select Option",
  onTapOpenDropdown = () => {},
  style = {},
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

  // Update menu position based on the trigger button
  const updateCoords = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY + 6, // 6px gap below button
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  // Toggle menu and calculate coordinates
    const handleToggle = () => {
      console.log("Dropdown toggle clicked");
    if (disabled) return;
        if (!isOpen) {
            onTapOpenDropdown();
        
      updateCoords();
    }
    setIsOpen((prev) => !prev);
  };

  // Close when clicking outside or scrolling
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !event.target.closest(".dropdown-portal-menu")
      ) {
        setIsOpen(false);
      }
    };

    const handleScrollOrResize = () => {
      if (isOpen) updateCoords();
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen]);

    const handleSelect = (optionValue) => {
      console.log("Selected Option:", optionValue);
    onChange(optionValue);
    setIsOpen(false);
  };

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div
      ref={dropdownRef}
      style={style}
      className={`custom-dropdown-container dropdown-size-${size} dropdown-variant-${variant} ${
        disabled ? "disabled" : ""
      } ${className}`}
    >
      {label && <label className="dropdown-label">{label}</label>}

      <button
        ref={buttonRef}
        type="button"
        className={`dropdown-header ${isOpen ? "open" : ""}`}
        onClick={handleToggle}
        disabled={disabled}
      >
        <span className="dropdown-selected">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={`dropdown-arrow ${isOpen ? "rotated" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Renders the dropdown list outside of current hierarchy via Portal */}
      {isOpen &&
        createPortal(
          <ul
            className={`dropdown-menu dropdown-portal-menu dropdown-size-${size} dropdown-variant-${variant}`}
            style={{
              position: "absolute",
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              width: `${coords.width}px`,
              zIndex: 99999, // Highest z-index globally
            }}
          >
            {options.map((option) => (
              <li
                key={option.value}
                className={`dropdown-item ${
                  option.value === value ? "selected" : ""
                }`}
                onClick={() => handleSelect(option.value)}
              >
                <span>{option.label}</span>
                {option.value === value && (
                  <span className="check-mark">✓</span>
                )}
              </li>
            ))}
          </ul>,
          document.body
        )}
    </div>
  );
};

export default Dropdown;