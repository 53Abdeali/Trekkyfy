"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { initializeSocket } from "@/app/socket";
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

interface HikerModalProps {
  guide: Guide;
  hiker: Hiker | null;
  onClose: () => void;
}

interface DataDetails {
  guide_id: string;
  hiker_id: string;
  accepted: boolean;
}

const HikerModal: React.FC<HikerModalProps> = ({ guide, hiker, onClose }) => {
  if (!hiker) {
    return null;
  }

  const [chatRequested, setChatRequested] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState("");
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = initializeSocket(hiker.hiker_id, guide.guide_id, "hiker");
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log(`Hiker connected (ID: ${hiker.hiker_id})`);
      socket.emit("hiker_online", {
        hiker_id: hiker.hiker_id,
        user_type: "hiker",
      });
    });

    socket.on("chat_response", (data: DataDetails) => {
      if (data.hiker_id !== hiker.hiker_id) return;
      if (data.accepted) {
        toast.success("Chat accepted! Redirecting to WhatsApp.");
        setWhatsappLink(`https://wa.me/${guide.guide_whatsapp}`);
      } else {
        toast.error("Chat request was rejected by the guide.");
      }
    });

    return () => {
      socket.off("chat_response");
    };
  }, [guide.guide_id, hiker.hiker_id, guide.guide_whatsapp]);

  const handleRequestChat = () => {
    if (!socketRef.current) {
      toast.error("Socket not connected.");
      return;
    }

    console.log("📡 Emitting chat_request from hiker:", {
      guide_id: guide.guide_id,
      hiker_id: hiker.hiker_id,
      user_type: "hiker",
    });

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
          setChatRequested(true);
        } else {
          console.error("Failed to send chat request:", response.error);
          toast.error("Failed to send chat request.");
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
              <span className="request-button" onClick={handleRequestChat}>
                Request Chat
              </span>
            </div>
            {chatRequested && whatsappLink && (
              <div className="whatsapp-link">
                <p>
                  <strong>Chat with Guide on WhatsApp:</strong>{" "}
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Click here to chat
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HikerModal;
