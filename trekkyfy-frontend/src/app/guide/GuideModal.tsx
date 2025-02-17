"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import "@/app/stylesheet/guidemodal.css";
import socket from "@/app/socket";
import toast from "react-hot-toast";

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

const GuideModal: React.FC<GuideModalProps> = ({ guide, hiker, onClose }) => {
  const [chatAccepted, setChatAccepted] = useState(false);

  const handleRequestChat = () => {
    if (!hiker) {
      toast.error("You must be logged in to send a chat request.");
      return;
    }
    socket.emit(
      "chat_request",
      { guide_id: guide.guide_id, hiker_id: hiker.hiker_id },
      (response: ChatRequestResponse) => {
        if (response.status === "success") {
          toast.success("Chat Request Sent!");
        } else {
          console.error("Failed to send chat request:", response.error);
        }
      }
    );
  };

  useEffect(() => {
    socket.on("chat_response", (data) => {
      if (data.accepted && data.guide_id === guide.guide_id) {
        toast.success("Chat accepted! You can now chat on WhatsApp.");
        setChatAccepted(true);
      } else if (data.accepted === false && data.guide_id === guide.guide_id) {
        toast.error("Chat request rejected.");
      }
    });

    return () => {
      socket.off("chat_response");
    };
  }, [guide.guide_id]);

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
