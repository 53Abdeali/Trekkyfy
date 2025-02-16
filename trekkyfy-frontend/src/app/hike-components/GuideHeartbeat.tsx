"use client";
import React, { useEffect, useRef } from "react";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";
import { io, Socket } from "socket.io-client";

interface TokenPayload {
  guide_id?: string;
}

const getGuideIdFromToken = (): string | null => {
  const token = Cookies.get("access_token");
  if (!token) return null;
  try {
    const decoded: TokenPayload = jwtDecode(token);
    return decoded.guide_id || null;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

const GuideHeartbeat: React.FC = () => {
  const socketRef = useRef<Socket | null>(null);
  const guideId = getGuideIdFromToken();

  useEffect(() => {
    if (!guideId) {
      console.error("No guide_id found; cannot start heartbeat.");
      return;
    }

    socketRef.current = io("https://trekkyfy.onrender.com", {
      transports: ["websocket"],
      query: { guide_id: guideId },
    });

    socketRef.current.on("connect", () => {
      console.log("Connected to socket.io server for heartbeat");
    });

    const heartbeatInterval = setInterval(() => {
      socketRef.current?.emit("heartbeat", { guide_id: guideId });
      console.log("Heartbeat sent for guide_id:", guideId);
    }, 60000);

    socketRef.current.on("disconnect", () => {
      console.log("Disconnected from socket.io server");
    });

    return () => {
      clearInterval(heartbeatInterval);
      socketRef.current?.disconnect();
    };
  }, [guideId]);

  return null;
};

export default GuideHeartbeat;
