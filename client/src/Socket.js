// Socket.js
import { io } from "socket.io-client";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const initSocket = () => {
  const options = {
    transports: ["websocket"],
    reconnectionAttempts: 3,
    timeout: 10000,
    forceNew: true,
  };
  return io(BACKEND_URL, options);
};
