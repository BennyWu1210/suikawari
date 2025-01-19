"use client";

import React, { useEffect, useRef } from "react";
import { Box, Paper, Button } from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { setupCamera, apex } from "../../util/script.js";

export default function CamPage() {
  const videoRef = useRef<HTMLVideoElement>(null);

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
