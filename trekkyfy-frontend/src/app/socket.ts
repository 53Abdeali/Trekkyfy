import { io } from "socket.io-client";

const socket = io("https://trekkyfy.onrender.com", {
  transports: ["websocket"],
});

export default socket;
