"use client";

import React, { useEffect, useRef } from "react";
import { Box, Paper } from "@mui/material";
import { setupCamera, apex } from "../../util/script.js";
import { initializeSocket } from "@/util/script";

export default function CamPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    async function initializeCamera() {
      if (videoRef.current) {
        console.log("Notifying server as Apex camera...");
        await apex();

        console.log("Setting up camera...");
        await setupCamera(videoRef.current);
      }
    }
    initializeCamera();
  }, []);
  
  useEffect(() => {
    const socket = initializeSocket();
    socketRef.current = socket;

    // Request initial comments
    socket.emit("getComments");

    // Listen for initial comments response
    socket.on("comment", (comment: string) => {
      var msg = new SpeechSynthesisUtterance();
      msg.text = comment;
      window.speechSynthesis.speak(msg);
    });

    return () => {
      socket.off("comment");
    };
  }, []);

  return (
    <div className="relative z-10 flex items-center justify-center h-screen">
      <Paper
        elevation={6}
        sx={{
          width: "auto",
          padding: "16px",
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          borderRadius: "12px",
        }}
      >
        <Box className="flex justify-center items-center w-full h-auto">
          <video
            ref={videoRef}
            id="camera"
            muted
            autoPlay
            playsInline
            className="w-full h-auto rounded shadow-lg"
          />
        </Box>
      </Paper>
    </div>
  );
}
