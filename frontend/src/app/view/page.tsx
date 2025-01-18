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
    <Grid container height={"full"} spacing={2} sx={{ flex: 1 }}>
      <Grid item xs={12} md={6}>
      <video
         ref={videoRef}
          id="viewer"
          muted
          autoPlay
          playsInline
          className="w-full h-auto rounded shadow-lg"
        />
      </Grid>
      <Grid item xs={12} md={6} display="flex" alignItems="center" justifyContent="center">
          <ControlPanel />
      </Grid>
      <Grid item xs={12}>
        <CommentsField />
      </Grid>
  </Grid>
  );
}
