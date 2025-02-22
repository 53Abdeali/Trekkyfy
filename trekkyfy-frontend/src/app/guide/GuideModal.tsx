"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import "@/app/stylesheet/guidemodal.css";
import { initializeSocket } from "@/app/socket";
import toast from "react-hot-toast";
import { Socket } from "socket.io-client";
import axiosInstance from "@/utils/axiosConfig";
import Cookies from "js-cookie";

interface ChatRequestResponse {
  status: "success" | "error";
  error?: string;
}

interface Guide {
  id: string;
  guide_id: string;
  guide_city: string;
  guide_district: string;
  guide_state: string;
  guide_phone: string;
  guide_whatsapp: string;
  guide_experience: string;
  guide_languages: string;
  guide_speciality: string;
  guide_photo: string;
  username?: string;
  email?: string;
  last_seen?: string;
}

interface Hiker {
  hiker_id: string;
  hiker_username: string;
}

interface GuideModalProps {
  guide: Guide;
  hiker: Hiker | null;
  onClose: () => void;
}

const GuideModal: React.FC<GuideModalProps> = ({ guide, hiker, onClose }) => {
  const socketRef = useRef<Socket | null>(null);
  const [requestPending, setRequestPending] = useState<boolean>(false);
  const userType = hiker ? "hiker" : "guide";
  const userId = hiker ? hiker.hiker_id : guide.guide_id;
  const token = Cookies.get("access_token");

  useEffect(() => {
    socketRef.current = initializeSocket(userId, guide.guide_id, userType);

    socketRef.current?.on("connect", () => {
      if (userType === "hiker") {
        console.log(`Hiker connected (ID: ${hiker?.hiker_id})`);
        socketRef.current?.emit("hiker_online", {
          hiker_id: hiker?.hiker_id,
          user_type: "hiker",
        });
      } else {
        console.log(`Guide connected (ID: ${guide.guide_id})`);
        socketRef.current?.emit("guide_online", {
          guide_id: guide.guide_id,
          user_type: "guide",
        });
      }
    });
  }, [guide.guide_id, hiker, userId, userType]);

  const checkChatRequestStatus = async () => {
    if (!hiker) return;
    try {
      const res = await axiosInstance.get("/pending-requests", {
        params: { guide_id: guide.guide_id},
        headers: {Authorization:`Bearer ${token}`}
      });
      const pending = res.data.some(
        (req: { hiker_id: string; status: string }) =>
          req.hiker_id === hiker.hiker_id && req.status === "pending"
      );
      setRequestPending(pending);
    } catch (error) {
      console.error("Error checking chat request status:", error);
    }
  };

  useEffect(() => {
    if (hiker) {
      checkChatRequestStatus();
      const intervalId = setInterval(checkChatRequestStatus, 5000);
      return () => clearInterval(intervalId);
    }
  }, [guide.guide_id, hiker]);


  const handleRequestChat = () => {
    if (!hiker) {
      toast.error("You must be logged in as a hiker to send a chat request.");
      return;
    }

    if (requestPending) {
      toast.error("Chat request already pending. Please wait for a response.");
      return;
    }

    console.log("📡 Emitting chat_request:", {
      guide_id: guide.guide_id,
      hiker_id: hiker.hiker_id,
      hiker_username: hiker.hiker_username,
      user_type: "hiker",
    });

    socketRef.current?.emit(
      "chat_request",
      {
        guide_id: guide.guide_id,
        hiker_id: hiker.hiker_id,
        hiker_username: hiker.hiker_username,
        user_type: "hiker",
      },
      (response: ChatRequestResponse) => {
        if (!response) {
          console.error("No response received from server");
          return;
        }
        if (response.status === "success") {
          toast.success("Chat Request Sent!");
          console.log("Chat request sent successfully!");
          setRequestPending(true);
        } else {
          console.error("Failed to send chat request:", response.error);
        }
      }
    );
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-close-btn">
          <button className="modal-close" onClick={onClose}>
            <FontAwesomeIcon icon={faClose} />
          </button>
        </div>
        <div className="modal-body">
          <div className="modal-container modal-left">
            <h2>{guide.username}</h2>
            <p className="modal-add">
              {guide.guide_district}, {guide.guide_city}, {guide.guide_state}
            </p>
            <div className="modal-img-st">
              <Image
                src={guide.guide_photo || "/placeholder.jpg"}
                alt={`${guide.username}'s profile`}
                width={200}
                height={200}
                className="modal-guide-img"
              />
              <p>
                <strong>Status:</strong>{" "}
                {guide.last_seen
                  ? new Date(guide.last_seen).toLocaleString() + " UTC"
                  : "N/A"}
              </p>
            </div>
            <div className="modal-heads">
              <p className="modal-contact">
                <strong>Phone:</strong> {guide.guide_phone}
              </p>
              <p className="modal-contact">
                <strong>Whatsapp:</strong> {guide.guide_whatsapp}
              </p>
              <p className="modal-contact">
                <strong>Email:</strong> {guide.email}
              </p>
            </div>
            <div className="request-buttons">
              <span className="request-button">
                Request Pricing & Availability
              </span>
              <span
                className="request-button"
                onClick={handleRequestChat}
                style={{
                  pointerEvents: requestPending ? "none" : "auto",
                  opacity: requestPending ? 0.5 : 1,
                }}
              >
                {requestPending ? "Request Pending" : "Request Chat"}
              </span>
            </div>
          </div>

          <div className="vertical-divider" />
          <div className="modal-container modal-right">
            <p>
              <strong>Experience:</strong>{" "}
              <span> {guide.guide_experience}</span>
            </p>
            <p>
              <strong>Languages:</strong> {guide.guide_languages}
            </p>
            <p>
              <strong>Speciality:</strong> {guide.guide_speciality}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideModal;
