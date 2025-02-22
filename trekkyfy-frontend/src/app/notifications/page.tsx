"use client";

import { useEffect, useRef, useState } from "react";
import NotificationPopup, {
  ChatRequest,
} from "@/app/hike-components/notificationpopup";
import HikerNotificationPopup, {
  ChatResponse,
} from "@/app/hike-components/hikernotificationpopup";
import toast from "react-hot-toast";
import axiosInstance from "@/utils/axiosConfig";
import axios from "axios";
import { getSocket } from "../socket";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import "@/app/stylesheet/notification.css";
import {
  faArrowCircleLeft,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface DecodedToken {
  guide_id?: string;
  hiker_id?: string;
}

export default function Notification() {
  const [userRole, setUserRole] = useState<"guide" | "hiker" | null>(null);
  const [chatRequests, setChatRequests] = useState<ChatRequest[]>([]);
  const [chatResponses, setChatResponses] = useState<ChatResponse[]>([]);
  const [guideId, setGuideId] = useState<string | null>(null);
  const [currentHikerId, setCurrentHikerId] = useState<string | null>(null);
  const [showProfileDown, setShowProfileDown] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const socket = getSocket();
  const token = Cookies.get("access_token");
  const router = useRouter();
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!token) {
      //   router.push("/login");
      return;
    }
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
  }, [token, router]);

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
  }, [userRole, guideId, currentHikerId]);

  const handleAccept = async (request: ChatRequest) => {
    try {
      const response = await axios.get("/guide", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { guide_id: guideId },
      });
      if (response.status === 200) {
        const guideWhatsAppNumber = response.data.guide_whatsapp;
        const payload = {
          guide_id: guideId,
          hiker_id: request.hiker_id,
          accepted: true,
          guide_whatsapp: guideWhatsAppNumber,
        };
        console.log("Emitting chat_response with payload:", payload);
        socket?.emit("chat_response", payload);

        setChatRequests((prev) =>
          prev.filter((r) => r.hiker_id !== request.hiker_id)
        );
      }
    } catch (error) {
      console.error("Failed to fetch guide WhatsApp number:", error);
      toast.error("Error fetching WhatsApp number.");
    }
  };

  const handleReject = (request: ChatRequest) => {
    const payload = {
      guide_id: guideId,
      hiker_id: request.hiker_id,
      accepted: false,
    };
    console.log("Emitting chat_response with payload:", payload);
    socket?.emit("chat_response", payload);
    setChatRequests((prev) =>
      prev.filter((r) => r.hiker_id !== request.hiker_id)
    );
  };

  const handleOpenChat = (guide_whatsapp: string) => {
    if (!guide_whatsapp) {
      console.error("❌ No WhatsApp number available!");
      return;
    }
    const whatsappLink = `https://wa.me/${guide_whatsapp}`;
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
    <>
      {isAuthenticated && (
        <div className="notifications-page">
          <header>
            <Link className="not-link" href="/">
              <FontAwesomeIcon className="not-icon" icon={faArrowCircleLeft} />
            </Link>
            <h1>
              Notifications{" "}
              <span>
                {userRole === "guide" && chatResponses.length > 0 && (
                  <span className="badge">{chatResponses.length}</span>
                )}
                {userRole === "hiker" && chatResponses.length > 0 && (
                  <span className="badge">{chatResponses.length}</span>
                )}
              </span>
            </h1>
            <div ref={profileRef} className="profile-container">
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
            </div>
          </header>
          <main>
            {userRole === "guide" ? (
              <NotificationPopup
                requests={chatRequests}
                onAccept={handleAccept}
                onReject={handleReject}
              />
            ) : (
              <HikerNotificationPopup
                notifications={chatResponses}
                onOpenChat={handleOpenChat}
                onDismiss={handleDismissResponse}
              />
            )}
          </main>
        </div>
      )}
    </>
  );
}
