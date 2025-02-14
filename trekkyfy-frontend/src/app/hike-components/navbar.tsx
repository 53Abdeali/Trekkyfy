import Link from "next/link";
import "@/app/stylesheet/navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import axiosInstance from "@/utils/axiosConfig";
import toast from "react-hot-toast";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [showNavElement, setShowNavElement] = useState(false);
  const pathname = usePathname();
  const [activeLink, setActiveLink] = useState(pathname || "/");
  const [showProfileDown, setShowProfileDown] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const profileRef = useRef<HTMLLIElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveLink(pathname);
  }, [pathname]);

  useEffect(() => {
    const token = Cookies.get("access_token");
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        navRef.current?.contains(event.target as Node) ||
        profileRef.current?.contains(event.target as Node)
      ) {
        return;
      }
      setShowNavElement(false);
      setShowProfileDown(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const logout = async () => {
    try {
      const response = await axiosInstance.post("/logout");
      if (response.status === 200) {
        setIsAuthenticated(false);
        Cookies.remove("access_token");
        window.location.href = "/";
        toast.success("Logout Succesfully");
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="nav-main" ref={navRef}>
      <div className="nav-logo">
        <h1>Trekkyfy</h1>
      </div>
      {!isAuthenticated ? (
        <>
          <div
            ref={navRef}
            className={showNavElement ? "mob-nav-opt" : "nav-opt"}
          >
            <ul className="nav-ul">
              <li>
                <Link
                  className={`nav-opt-link ${
                    activeLink === "/" ? "active" : ""
                  }`}
                  href="/"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  className={`nav-opt-link ${
                    activeLink === "/about" ? "active" : ""
                  }`}
                  href="/about"
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
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div className="nav-link">
            <ul className="nav-ul-link">
              <li>
                <Link className="nav-opt-link" href="/login">
                  Login / Register
                </Link>
              </li>
            </ul>
          </div>
        </>
      ) : (
        <>
          <div ref={navRef} className={showNavElement ? "mob-nav-opt" : "nav-opt nav-auth"}>
            <ul className="nav-ul">
              <li>
                <Link
                  className={`nav-opt-link ${
                    activeLink === "/" ? "active" : ""
                  }`}
                  href="/"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  className={`nav-opt-link ${
                    activeLink === "/guide" ? "active" : ""
                  }`}
                  href="/guide"
                >
                  Guides
                </Link>
              </li>
              <li>
                <Link
                  className={`nav-opt-link ${
                    activeLink === "/trek-trails" ? "active" : ""
                  }`}
                  href="/trek-trails"
                >
                  Trek & Trails
                </Link>
              </li>
              <li>
                <Link
                  className={`nav-opt-link ${
                    activeLink === "/explore" ? "active" : ""
                  }`}
                  href="/explore"
                >
                  Explore
                </Link>
              </li>
              <li>
                <Link
                  className={`nav-opt-link ${
                    activeLink === "/contact" ? "active" : ""
                  }`}
                  href="/contact"
                >
                  Contact Us
                </Link>
              </li>
              <li ref={profileRef} className="profile-container">
                <span
                  onClick={() => setShowProfileDown(!showProfileDown)}
                  className="profile-icon"
                >
                  <FontAwesomeIcon
                    className="nav-prof-icon"
                    icon={faUserCircle}
                    size="lg"
                  />
                </span>
                {showProfileDown && (
                  <div className="profile-dropdown">
                    <Link href="/profile" className="dropdown-item">
                      Profile
                    </Link>
                    <span
                      onClick={() => {
                        logout();
                        setIsAuthenticated(false);
                      }}
                      className="dropdown-item"
                    >
                      Logout
                    </span>
                  </div>
                )}
              </li>
            </ul>
          </div>
        </>
      )}

      <div className="hamburger">
        <span onClick={() => setShowNavElement(!showNavElement)}>
          <FontAwesomeIcon className="nav-bar" icon={faBars} />
        </span>
      </div>
    </div>
  );
}
