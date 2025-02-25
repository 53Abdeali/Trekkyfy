"use client";

import Link from "next/link";
import "@/app/stylesheet/navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faUserCircle,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import axiosInstance from "@/utils/axiosConfig";
import toast from "react-hot-toast";
import { usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";

import { getSocket, initializeSocket } from "@/app/socket";
import { ChatRequest } from "./notificationpopup";
import { ChatResponse } from "./hikernotificationpopup";
import { PriavlRequest } from "./PriceAvailabilityPopup";
import { PriavlResponse } from "./PriceAvailabilityResponse";

interface DecodedToken {
  guide_id?: string;
  hiker_id?: string;
}

export default function Navbar() {
  const [showNavElement, setShowNavElement] = useState(false);
  const pathname = usePathname();
  const [activeLink, setActiveLink] = useState(pathname || "/");
  const [showProfileDown, setShowProfileDown] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<"guide" | "hiker" | null>(null);
  const [chatRequests, setChatRequests] = useState<ChatRequest[]>([]);
  const [priavlRequests, setPriavlRequests] = useState<PriavlRequest[]>([]);
  const [chatResponses, setChatResponses] = useState<ChatResponse[]>([]);
  const [priavlResponses, setPriavlResponses] = useState<PriavlResponse[]>([]);
  const [guideId, setGuideId] = useState<string | null>(null);
  const [currentHikerId, setCurrentHikerId] = useState<string | null>(null);

  const profileRef = useRef<HTMLLIElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveLink(pathname);
  }, [pathname]);

  const token = Cookies.get("access_token");
  useEffect(() => {
    if (!token) return;
    setIsAuthenticated(true);
    try {
      const decoded: DecodedToken = jwtDecode(token);
      if (decoded.guide_id) {
        setUserRole("guide");
        setGuideId(decoded.guide_id);
      } else if (decoded.hiker_id) {
        setUserRole("hiker");
        setCurrentHikerId(decoded.hiker_id);
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, [token]);

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [socket, setSocket] = useState(() => {
    return getSocket();
  });

  useEffect(() => {
    if (userRole === "guide" && guideId) {
      const guideSocket = initializeSocket(guideId, "", "guide");
      setSocket(guideSocket);
    } else if (userRole === "hiker" && currentHikerId) {
      const hikerSocket = initializeSocket(currentHikerId, "", "hiker");
      setSocket(hikerSocket);
    }
  }, [userRole, guideId, currentHikerId]);

  useEffect(() => {
    if (userRole === "guide" && socket) {
      socket.on("chat_request", (request: ChatRequest) => {
        console.log("Received chat request:", request);
        setChatRequests((prev) => [...prev, request]);
      });
    }
    return () => {
      socket?.off("chat_request");
    };
  }, [userRole, socket]);

  useEffect(() => {
    if (userRole === "guide" && socket) {
      socket.on("price_availability_req", (request: PriavlRequest) => {
        console.log("Received chat request:", request);
        setPriavlRequests((prev) => [...prev, request]);
      });
    }
    return () => {
      socket?.off("price_availability_req");
    };
  }, [userRole, socket]);

  useEffect(() => {
    if (userRole === "hiker" && socket) {
      socket.on(
        "chat_response",
        (data: {
          accepted: boolean;
          guide_whatsapp?: string;
          hiker_id?: string;
          message?: string;
        }) => {
          if (data.hiker_id && data.hiker_id !== currentHikerId) return;
          setChatResponses((prev) => [...prev, data]);
        }
      );
    }
    return () => {
      socket?.off("chat_response");
    };
  }, [userRole, currentHikerId, socket]);

  useEffect(() => {
    if (userRole === "hiker" && socket) {
      socket.on(
        "price_availability_response",
        (data: {
          id: string;
          accepted: boolean;
          guide_username?: string;
          guide_id?: string;
          price: string;
          hiker_id?: string;
          availability: string;
          partialTime: string;
          unavailableOption: string;
          unavailabilityReason: string;
          trek_place: string;
          trek_date: string;
          trek_time: string;
        }) => {
          if (data.hiker_id && data.hiker_id !== currentHikerId) return;
          setPriavlResponses((prev) => [...prev, data]);
        }
      );
    }
    return () => {
      socket?.off("price_availability_response");
    };
  }, [userRole, currentHikerId, socket]);

  useEffect(() => {
    if (userRole === "guide" && guideId) {
      axiosInstance
        .get("/pending-requests", {
          params: { guide_id: guideId },
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log("Fetching pending request", res.data);
          setChatRequests(res.data);
        })
        .catch((err) => {
          console.log("Error fetching pending request", err);
        });
    } else if (userRole === "hiker" && currentHikerId) {
      axiosInstance
        .get("/pending-responses", {
          params: { hiker_id: currentHikerId },
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setChatResponses(res.data);
        })
        .catch((err) => {
          console.error("Error fetching pending responses:", err);
          toast.error("Error fetching notifications.");
        });
    }
  }, [userRole, guideId, currentHikerId, token]);

  useEffect(() => {
    if (userRole === "guide" && guideId) {
      axiosInstance
        .get("/pri-avl", {
          params: { guide_id: guideId },
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log(
            "Fetching pending price and availability request",
            res.data
          );
          setPriavlRequests(res.data);
        })
        .catch((err) => {
          console.log(
            "Error fetching pending price and availability request",
            err
          );
        });
    } else if (userRole === "hiker" && currentHikerId) {
      axiosInstance
        .get("/guide-priavl-res", {
          params: { hiker_id: currentHikerId },
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setChatResponses(res.data);
        })
        .catch((err) => {
          console.error("Error fetching pending responses:", err);
          toast.error("Error fetching notifications.");
        });
    }
  }, [userRole, guideId, token, currentHikerId]);

  const logout = async () => {
    try {
      const response = await axiosInstance.post("/logout");
      if (response.status === 200) {
        setIsAuthenticated(false);
        Cookies.remove("access_token");
        window.location.href = "/";
        toast.success("Logout Successfully");
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
          <div
            ref={navRef}
            className={showNavElement ? "mob-nav-opt" : "nav-opt nav-auth"}
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
              {userRole === "hiker" && (
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
              )}
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
              <li className="notification-container">
                <Link href="/notifications">
                  <span className="notification-icon">
                    <FontAwesomeIcon icon={faBell} size="lg" />
                    {userRole === "guide" &&
                      chatRequests.length + priavlRequests.length > 0 && (
                        <span className="badge">
                          {chatRequests.length + priavlRequests.length}
                        </span>
                      )}
                    {userRole === "hiker" &&
                      chatResponses.length + priavlResponses.length > 0 && (
                        <span className="badge">
                          {chatResponses.length + priavlResponses.length}
                        </span>
                      )}
                  </span>
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
