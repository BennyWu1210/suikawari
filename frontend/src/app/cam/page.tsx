"use client";

import React, { useEffect, useRef } from "react";
import { Box, Paper, Button } from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { camera } from "../../util/script.js";

export default function CamPage() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    async function initializeCamera() {
      console.log("Setting up camera...");
      camera();
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
          <canvas
            id="canvas"
          />
        </Box>
        <Button
          sx={{
            marginTop: "16px",
            color: "white",
            background: "linear-gradient(to right, #4e54c8, #8f94fb)",
            "&:hover": {
              background: "linear-gradient(to right, #3b47a3, #6b6ee8)",
            },
          }}
        >
          <KeyboardBackspaceIcon />
          Back to Main
        </Button>
      </Paper>
    </div>
  );
}
