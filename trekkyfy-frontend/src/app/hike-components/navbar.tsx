import Link from "next/link";
import "@/app/stylesheet/navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUser } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";

export default function Navbar() {
  const [showNavElement, setShowNavElement] = useState(false);
  const [activeLink, setActiveLink] = useState("/");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const profileRef = useRef<HTMLLIElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = Cookies.get("access_token");
    setIsAuthenticated(!!token);
  },[])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        navRef.current?.contains(event.target as Node) ||
        profileRef.current?.contains(event.target as Node)
      ) {
        return;
      }
      setShowNavElement(false);
      setShowProfileDropdown(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="nav-main" ref={navRef}>
      <div className="nav-logo">
        <h1>TrekYatra</h1>
      </div>

      <div className={showNavElement ? "mob-nav-opt" : "nav-opt"}>
        <ul className="nav-ul">
          <li>
            <Link
              className={`nav-opt-link ${activeLink === "/" ? "active" : ""}`}
              href="/"
              onClick={() => setActiveLink("/")}
            >
              Home
            </Link>
          </li>
          {isAuthenticated ? (
            <>
              <li>
                <Link
                  className={`nav-opt-link ${
                    activeLink === "/guides" ? "active" : ""
                  }`}
                  href="/guides"
                  onClick={() => setActiveLink("/guides")}
                >
                  Guides
                </Link>
              </li>
              <li>
                <Link
                  className={`nav-opt-link ${
                    activeLink === "/treks" ? "active" : ""
                  }`}
                  href="/treks"
                  onClick={() => setActiveLink("/treks")}
                >
                  Treks & Trails
                </Link>
              </li>
              <li>
                <Link
                  className={`nav-opt-link ${
                    activeLink === "/contact" ? "active" : ""
                  }`}
                  href="/contact"
                  onClick={() => setActiveLink("/contact")}
                >
                  Contact
                </Link>
              </li>
              {/* Profile Dropdown */}
              <li ref={profileRef} className="profile-container">
                <span
                  className="nav-opt-link profile-icon"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent navbar from closing
                    setShowProfileDropdown(!showProfileDropdown);
                  }}
                >
                  <FontAwesomeIcon icon={faUser} />
                </span>
                {showProfileDropdown && (
                  <div
                    className="profile-dropdown"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Link href="/profile" className="dropdown-item">
                      Profile
                    </Link>
                    <Link href="/settings" className="dropdown-item">
                      Settings
                    </Link>
                    <button className="dropdown-item logout-btn">Logout</button>
                  </div>
                )}
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  className={`nav-opt-link ${
                    activeLink === "/about" ? "active" : ""
                  }`}
                  href="/about"
                  onClick={() => setActiveLink("/about")}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  className={`nav-opt-link ${
                    activeLink === "/services" ? "active" : ""
                  }`}
                  href="/services"
                  onClick={() => setActiveLink("/services")}
                >
                  Our Services
                </Link>
              </li>
              <li>
                <Link
                  className={`nav-opt-link ${
                    activeLink === "/contact" ? "active" : ""
                  }`}
                  href="/contact"
                  onClick={() => setActiveLink("/contact")}
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link className="nav-opt-link" href="/login">
                  Login / Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>

      <div className="hamburger">
        <span onClick={() => setShowNavElement(!showNavElement)}>
          <FontAwesomeIcon className="nav-bar" icon={faBars} />
        </span>
      </div>
    </div>
  );
}
