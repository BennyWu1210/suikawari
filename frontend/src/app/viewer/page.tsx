"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";

export default function ViewerPage() {
  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("connect", () => {
      console.log("Viewer connected! ID =", socket.id);
    });

    socket.on("requestForAnswerPlOffer", (offer: string) => {
      console.log("Received offer from camera:", offer);
      // Typically you'd create a WebRTC answer and emit back:
      // socket.emit("answer", { answer: "yourAnswer", camera: "cameraSocketId" });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <main>
      <h1>Viewer Page</h1>
      {/* This can display the stream or handle signaling as needed */}
    </main>
  );
}
