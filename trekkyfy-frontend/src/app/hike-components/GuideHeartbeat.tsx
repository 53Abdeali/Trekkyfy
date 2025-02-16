"use client";
import React, { useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { io, Socket } from "socket.io-client";

interface TokenPayload {
  guide_id?: string;
  hiker_id?: string;
}

const getUserDetailsFromToken = (): {
  user_id: string | null;
  user_type: string | null;
} => {
  const token = Cookies.get("access_token");
  if (!token) return { user_id: null, user_type: null };

  try {
    const decoded: TokenPayload = jwtDecode(token);

    if (decoded.guide_id)
      return { user_id: decoded.guide_id, user_type: "guide" };
    if (decoded.hiker_id)
      return { user_id: decoded.hiker_id, user_type: "hiker" };

    return { user_id: null, user_type: null };
  } catch (error) {
    console.error("Error decoding token:", error);
    return { user_id: null, user_type: null };
  }
};

const UserHeartbeat: React.FC = () => {
  const socketRef = useRef<Socket | null>(null);
  const { user_id, user_type } = getUserDetailsFromToken();

  useEffect(() => {
    if (!user_id || !user_type) {
      console.error("No user_id or user_type found; cannot start heartbeat.");
      return;
    }

    socketRef.current = io("https://trekkyfy.onrender.com", {
      transports: ["websocket"],
      query: { user_id, user_type },
    });

    socketRef.current.on("connect", () => {
      console.log(
        `Connected to socket.io server as ${user_type} (ID: ${user_id})`
      );
    });

    const heartbeatInterval = setInterval(() => {
      socketRef.current?.emit("heartbeat", { user_id });
      console.log(`Heartbeat sent for ${user_type} ID: ${user_id}`);
    }, 60000);

    socketRef.current.on("disconnect", () => {
      console.log("Disconnected from socket.io server");
    });

    return () => {
      clearInterval(heartbeatInterval);
      socketRef.current?.disconnect();
    };
  }, [user_id, user_type]);

  return null;
};

export default UserHeartbeat;
