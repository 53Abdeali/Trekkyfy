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
import NotificationPopup, { ChatRequest } from "./notificationpopup";
import HikerNotificationPopup, { ChatResponse } from "./hikernotificationpopup";

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
  // userRole can be either "guide" or "hiker"
  const [userRole, setUserRole] = useState<"guide" | "hiker" | null>(null);
  // For guides: incoming chat requests from hikers
  const [chatRequests, setChatRequests] = useState<ChatRequest[]>([]);
  const [showGuideNotification, setShowGuideNotification] = useState(false);
  // For hikers: responses from guides (accepted or rejected)
  const [chatResponses, setChatResponses] = useState<ChatResponse[]>([]);
  const [showHikerNotification, setShowHikerNotification] = useState(false);
  // Current hiker id (if logged in as hiker)
  const [guideId, setGuideId] = useState<string | null>(null);
  const [currentHikerId, setCurrentHikerId] = useState<string | null>(null);

  const profileRef = useRef<HTMLLIElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveLink(pathname);
  }, [pathname]);

  useEffect(() => {
    const token = Cookies.get("access_token");
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
  }, []);

  // Listen for clicks outside to close nav elements and dropdowns
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
      setShowGuideNotification(false);
      setShowHikerNotification(false);
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

  // For guides: Listen for incoming chat requests via Socket.IO
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

  // For hikers: Listen for chat responses from guides via Socket.IO
  useEffect(() => {
    if (userRole === "hiker" && socket) {
      socket.on(
        "chat_response",
        (data: {
          accepted: boolean;
          guideWhatsApp?: string;
          hikerId?: string;
          message?: string;
        }) => {
          // Ensure the response is meant for the current hiker
          if (data.hikerId && data.hikerId !== currentHikerId) return;
          setChatResponses((prev) => [...prev, data]);
        }
      );
    }
    return () => {
      socket?.off("chat_response");
    };
  }, [userRole, currentHikerId, socket]);

  useEffect(() => {
    if (userRole === "guide" && guideId) {
      axiosInstance
        .get("/pending-requests", { params: { guide_id: guideId } })
        .then((res) => {
          console.log("Fetching pending request", res.data);
          setChatRequests(res.data);
        })
        .catch((err) => {
          console.log("Error fetching pending request", err);
        });
    }
  }, [userRole, guideId]);

  // Handlers for guide notifications
  const handleAccept = async (request: ChatRequest) => {
    try {
      const response = await axiosInstance.get("/guide", {
        params: { guide_id: guideId },
      });
      if (response.status === 200) {
        const guideWhatsAppNumber = response.data.guide_whatsapp;
        socket?.emit("chat_response", {
          hikerId: request.hikerId,
          accepted: true,
          guideWhatsApp: guideWhatsAppNumber,
        });

        setChatRequests((prev) =>
          prev.filter((r) => r.hikerId !== request.hikerId)
        );
      }
    } catch (error) {
      console.error("Failed to fetch guide WhatsApp number:", error);
      toast.error("Error fetching WhatsApp number.");
    }
  };

  const handleReject = (request: ChatRequest) => {
    socket?.emit("chat_response", {
      hikerId: request.hikerId,
      accepted: false,
    });
    setChatRequests((prev) =>
      prev.filter((r) => r.hikerId !== request.hikerId)
    );
  };

  // Handlers for hiker notifications
  const handleOpenChat = (guideWhatsApp: string) => {
    const whatsappLink = `https://wa.me/${guideWhatsApp}`;
    window.open(whatsappLink, "_blank");
  };

  const handleDismissResponse = (index: number) => {
    setChatResponses((prev) => prev.filter((_, i) => i !== index));
  };

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
              {/* Notification icon for guides */}
              {userRole === "guide" && (
                <li className="notification-container">
                  <span
                    onClick={() =>
                      setShowGuideNotification(!showGuideNotification)
                    }
                    className="notification-icon"
                  >
                    <FontAwesomeIcon icon={faBell} size="lg" />
                    {chatRequests.length > 0 && (
                      <span className="badge">{chatRequests.length}</span>
                    )}
                  </span>
                </li>
              )}
              {/* Notification icon for hikers */}
              {userRole === "hiker" && (
                <li className="notification-container">
                  <span
                    onClick={() =>
                      setShowHikerNotification(!showHikerNotification)
                    }
                    className="notification-icon"
                  >
                    <FontAwesomeIcon icon={faBell} size="lg" />
                    {chatResponses.length > 0 && (
                      <span className="badge">{chatResponses.length}</span>
                    )}
                  </span>
                </li>
              )}
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

      {/* Guide Notification Popup */}
      {showGuideNotification && userRole === "guide" && (
        <NotificationPopup
          requests={chatRequests}
          onAccept={handleAccept}
          onReject={handleReject}
          onClose={() => setShowGuideNotification(false)}
        />
      )}

      {/* Hiker Notification Popup */}
      {showHikerNotification && userRole === "hiker" && (
        <HikerNotificationPopup
          notifications={chatResponses}
          onOpenChat={handleOpenChat}
          onDismiss={handleDismissResponse}
          onClose={() => setShowHikerNotification(false)}
        />
      )}
    </div>
  );
}
