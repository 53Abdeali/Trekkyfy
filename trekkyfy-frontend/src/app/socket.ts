import { io } from "socket.io-client";

const socket = io("https://trekkyfy.onrender.com:5000");

export default socket;
