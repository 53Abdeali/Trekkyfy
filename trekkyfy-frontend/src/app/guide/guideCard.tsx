"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { io, Socket } from "socket.io-client";
import GuideModal from "./GuideModal";
import "@/app/stylesheet/guideCard.css";

interface Guide {
  id: string;
  guide_id:string;
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
  id: string;
  username: string;
}

const GuideCard: React.FC<{ guide: Guide; hiker: Hiker | null }> = ({
  guide,
  hiker,
}) => {
  const [isOnline, setIsOnline] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal]);

  return (
    <>
      <div className="guide-profile">
        <div className="guide-card">
          <h2>{guide.username}</h2>
          <p className="guide-residence">
            {guide.guide_district}, {guide.guide_city}, {guide.guide_state}
          </p>
          <div className="guide-card-image">
            <Image
              src={guide.guide_photo || "/placeholder.jpg"}
              alt={`${guide.username}'s profile`}
              width={100}
              height={100}
              className="guide-card-img"
            />
            <p>
              <strong>Status:</strong>{" "}
              {isOnline ? (
                <span style={{ color: "green" }}>Online</span>
              ) : (
                <span style={{ color: "gray" }}>
                  Last seen:{" "}
                  {guide.last_seen
                    ? new Date(guide.last_seen).toLocaleString() + " UTC"
                    : "N/A"}
                </span>
              )}
            </p>
          </div>
          <div className="guide-details">
            <p className="guide-contact">
              <strong>Phone No.:</strong> {guide.guide_phone}
            </p>
            <p className="guide-contact">
              <strong>Whatsapp No.:</strong> {guide.guide_whatsapp}
            </p>
            <p className="guide-contact">
              <strong>Email:</strong> {guide.email}
            </p>
            <p className="guide-more" onClick={() => setShowModal(true)}>
              More About {guide.username}
            </p>
          </div>
        </div>
      </div>

      {showModal && (
        <GuideModal
          hiker={hiker}
          guide={guide}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default GuideCard;
