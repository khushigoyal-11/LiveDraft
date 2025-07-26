import { io } from "socket.io-client";

export const initSocket = async () => {
  const options = {
    transports: ["websocket"],
    forceNew: true,
    reconnectionAttempts: 5,
    timeout: 10000,
  };

  const socket = io(process.env.REACT_APP_BACKEND_URL, options);

  return socket;
};
