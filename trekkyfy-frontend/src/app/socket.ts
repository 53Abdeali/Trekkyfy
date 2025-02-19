import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initializeSocket = (hiker_id: string, guide_id: string, user_type: string) => {
  if (!socket) {
    socket = io("https://trekkyfy.onrender.com", {
      transports: ["websocket"],
      query: { hiker_id, guide_id, user_type },
    });
  }
  return socket;
};

export const getSocket = () => socket;
