// GEN: THIS IS NOT USED

import { BACKEND_URL } from "@/util/backend";
import { io, Socket } from "socket.io-client";

// You can export a single socket instance from here
let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    const backend = BACKEND_URL || "http://localhost:8000";
    socket = io(backend);
  }
  return socket;
};
