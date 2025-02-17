"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import "@/app/stylesheet/guidemodal.css";
import socket from "@/app/socket";
import toast from "react-hot-toast";
import { Socket } from "socket.io-client";

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
  username: string;
}

interface GuideModalProps {
  guide: Guide;
  hiker: Hiker | null;
  onClose: () => void;
}

interface DataDetails {
  guide_id: string;
  hiker_id: string;
  accepted: boolean;
}

const GuideModal: React.FC<GuideModalProps> = ({ guide, hiker, onClose }) => {
  const [chatAccepted, setChatAccepted] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  const handleRequestChat = () => {
    if (!hiker) {
      toast.error("You must be logged in to send a chat request.");
      return;
    }

    console.log("📡 Emitting chat_request:", {
      guide_id: guide.guide_id,
      hiker_id: hiker.hiker_id,
      user_type: "hiker",
    });

    if (socketRef.current) {
      socketRef.current.emit(
        "chat_request",
        {
          guide_id: guide.guide_id,
          hiker_id: hiker.hiker_id,
          user_type: "hiker",
        },
        (response: ChatRequestResponse) => {
          if (!response) {
            console.error("No response received from server");
            return;
          }

          if (response.status === "success") {
            toast.success("Chat Request Sent!");
          } else {
            console.error("Failed to send chat request:", response.error);
          }
        }
      );
    }
  };

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = socket;
      socketRef.current.on("connect", () => {
        if (hiker) {
          console.log(`Hiker connected (ID: ${hiker.hiker_id})`);
          socketRef.current?.emit("hiker_online", {
            hiker_id: hiker.hiker_id,
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
    }

    socketRef.current?.on("chat_response", (data: DataDetails) => {
      if (data.guide_id !== guide.guide_id) return;

      if (data.accepted) {
        toast.success("Chat accepted! You can now chat on WhatsApp.");
        setChatAccepted(true);
      } else {
        toast.error("Chat request rejected.");
      }
    });

    return () => {
      socketRef.current?.off("chat_response");
    };
  }, [guide.guide_id, hiker]);

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
              <span className="request-button" onClick={handleRequestChat}>
                Request Chat
              </span>
            </div>
            {chatAccepted && (
              <div className="whatsapp-link">
                <p>
                  <strong>Chat with Guide on WhatsApp:</strong>{" "}
                  <a
                    href={`https://wa.me/${guide.guide_whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Click here to chat
                  </a>
                </p>
              </div>
            )}
          </div>

          {/* Vertical Divider */}
          <div className="vertical-divider" />

          {/* Right Container */}
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
