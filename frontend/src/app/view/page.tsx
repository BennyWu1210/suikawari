"use client";

import React, { useEffect, useRef } from "react";
import { Box, Grid, useMediaQuery, useTheme } from "@mui/material";
import CommentsField from "../components/CommentsField";
import ControlPanel from "../components/ControlPanel";
import { setupViewer } from "../script";

export default function Page() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    if (videoRef.current) {
      console.log("Initializing viewer...");
      setupViewer(videoRef.current);
    }
  }, []);

  // Define known heights (adjust these values as needed)
  const navbarHeight = 64; // Example navbar height in px

  return (
    <Box 
      height={`calc(100vh - ${navbarHeight}px)`} 
      overflow="hidden"
      className="py-2"
    >
      <Grid container spacing={2} sx={{ height: "100%" }}>
        {/* Left Column: Video and Control Panel */}
        <Grid 
          item 
          xs={12} 
          md={8} 
          display="flex" 
          flexDirection="column" 
          justifyContent="space-between" 
          sx={{ height: "100%" }}
        >
          {/* Video Container */}
          <Box 
            flex="1" 
            display="flex" 
            alignItems="center" 
            justifyContent="center" 
            sx={{ position: "relative" }}
          >
            <video
              ref={videoRef}
              id="viewer"
              muted
              autoPlay
              playsInline
              className="rounded shadow-lg"
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
            {isSmallScreen && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: 16,
                  left: "50%",
                  transform: "translateX(-50%)",
                  backgroundColor: "rgba(255,255,255,0.8)",
                  borderRadius: 1,
                  p: 1,
                }}
              >
                <ControlPanel />
              </Box>
            )}
          </Box>

          {/* Control Panel for larger screens */}
          {!isSmallScreen && (
            <Box>
              <ControlPanel />
            </Box>
          )}
        </Grid>

        {/* Right Column: Comments Section */}
        <Grid 
          item 
          xs={12} 
          md={4} 
          sx={{ height: "100%", overflow: "auto" }} 
        >
          <CommentsField />
        </Grid>
      </Grid>
    </Box>
  );
}
