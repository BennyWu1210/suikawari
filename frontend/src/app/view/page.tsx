"use client";

import React, { useEffect, useRef } from "react";
import { Box, Grid, Paper } from "@mui/material";
import CommentsField from "../components/CommentsField";
import ControlPanel from "../components/ControlPanel";
import { setupViewer } from "../script";

export default function Page() {
  const videoRef = useRef(null); // Create a ref for the video element

  useEffect(() => {
    if (videoRef.current) {
      console.log("Initializing viewer...");
      setupViewer(videoRef.current); // Pass the ref to the setupViewer function
    }
  }, []);

  return (
    <Box
      padding={2}
      sx={{
        display: "flex",
        flexDirection: "column", // Stack items vertically
      }}
    >
      {/* Screen (Top Left) */}
        <video
         ref={videoRef}
          id="viewer"
          muted
          autoPlay
          playsInline
          className="w-full h-auto rounded shadow-lg"
        />
    </Box>
  );
}
