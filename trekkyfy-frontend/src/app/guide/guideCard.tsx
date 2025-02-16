"use client";

import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

interface Guide {
  id: string;
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

interface GuideCardProps {
  guide: Guide;
}

const GuideCard: React.FC<GuideCardProps> = ({ guide }) => {
  const [isOnline, setIsOnline] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io("https://trekkyfy.onrender.com");

    socketRef.current.on("connect", () => {
      console.log("Connected to socket.io server");
      socketRef.current?.emit("subscribe", { guideId: guide.id });
    });

    socketRef.current.on(
      "statusUpdate",
      (data: { guideId: string; status: string }) => {
        if (data.guideId === guide.id) {
          setIsOnline(data.status === "online");
        }
      }
    );

    socketRef.current.on("disconnect", () => {
      console.log("Disconnected from socket.io server");
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [guide.id]);

  return (
    <div
      className="guide-profile"
      style={{
        border: "1px solid #ddd",
        padding: "1rem",
        margin: "1rem 0",
        borderRadius: "8px",
      }}
    >
      <img
        src={guide.guide_photo || "/placeholder.jpg"}
        alt={`${guide.username}'s profile`}
        style={{
          width: "150px",
          height: "150px",
          objectFit: "cover",
          borderRadius: "50%",
        }}
      />
      <div className="guide-details" style={{ marginLeft: "1rem" }}>
        <h2>{guide.username}</h2>
        <p>
          {guide.guide_district}, {guide.guide_city}, {guide.guide_state}
        </p>
        <p>
          <strong>Languages:</strong> {guide.guide_languages}
        </p>
        <p>
          <strong>Experience:</strong> {guide.guide_experience}
        </p>
        <p>
          <strong>Specialities:</strong> {guide.guide_speciality}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          {isOnline ? (
            <span style={{ color: "green" }}>Online</span>
          ) : (
            <span style={{ color: "gray" }}>
              Last seen:{" "}
              {guide.last_seen
                ? new Date(guide.last_seen).toLocaleString()
                : "N/A"}
            </span>
          )}
        </p>
        <p>
          <strong>Contact:</strong> {guide.email}
        </p>
      </div>
    </div>
  );
};

export default GuideCard;
