import { io, Socket } from "socket.io-client";

// You can export a single socket instance from here
let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io("http://localhost:5000");
  }
  return socket;
};
