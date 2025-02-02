"use client";

import Link from "next/link";
import "@/app/stylesheet/navbar.css";
import "@/app/stylesheet/animate.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [activeLink, setActiveLink] = useState(pathname || "/");
  const [showNavElement, setShowNavElement] = useState(false);

  useEffect(() => {
    setActiveLink(pathname || "/");
  }, [pathname]);

  useEffect(() => {
    const elements = document.querySelectorAll(".animate");

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
        }
      });
    });

    elements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      elements.forEach((element) => {
        observer.unobserve(element);
      });
    };
  }, []);

  useEffect(() => {
    const handleTouchOutside = () => {
      if (showNavElement) {
        setTimeout(() => {
          setShowNavElement(false);
        }, 5000);
      }
    };
    window.addEventListener("touchstart", handleTouchOutside);
    return () => {
      window.removeEventListener("touchstart", handleTouchOutside);
    };
  }, [showNavElement]);

  return (
    <div className="nav-main">
      <div className="nav-logo animate">
        <h1>Trekkyfy</h1>
      </div>
      <div
        className={showNavElement ? "mob-nav-opt animate" : "nav-opt animate"}
      >
        <ul className="nav-ul">
          <li>
            <Link
              className={`nav-opt-link ${activeLink === "/" ? "active" : ""}`}
              onClick={() => setActiveLink("/")}
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
              onClick={() => setActiveLink("/about")}
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
              onClick={() => setActiveLink("/services")}
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
              onClick={() => setActiveLink("/contact")}
              href="/contact"
            >
              Contact Us
            </Link>
          </li>
        </ul>
      </div>
      <div className="nav-link">
        <ul className="nav-ul-link animate">
          <li>
            <Link className="nav-opt-link" href="/login">
              Login / Register
            </Link>
          </li>
        </ul>
      </div>
      <div className="hamburger animate">
        <span
          onClick={(e) => {
            e.preventDefault();
            setShowNavElement(!showNavElement);
          }}
        >
          <FontAwesomeIcon className="nav-bar animate" icon={faBars} />
        </span>
      </div>
    </div>
  );
}
