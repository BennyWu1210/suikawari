"use client";

import React, { useEffect, useRef, useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import CommentsField from "../components/CommentsField";
import ControlPanel from "../components/ControlPanel";
import { setupViewer } from "../../util/script";

export default function Page() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  
  // Lift the speech toggle state here
  const [speechActive, setSpeechActive] = useState<boolean>(true);

  useEffect(() => {
    if (videoRef.current) {
      console.log("Initializing viewer...");
      setupViewer(videoRef.current);
    }
  }, []);

  const navbarHeight = 64; // Example navbar height in px

  return (
    <Box
      height={`calc(100vh - ${navbarHeight}px)`}
      overflow="hidden"
      className="py-2"
      display="flex"
      flexDirection={isSmallScreen ? "column" : "row"}
    >
      {/* Video and Control Panel Section */}
      <Box
        flex={isSmallScreen ? "none" : "1"}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          width: isSmallScreen ? "100%" : "70%",
          height: "100%",
          maxHeight: isSmallScreen ? "50vh" : "70vh",
        }}
      >
        {/* Video Container */}
        <Box
          flex="1"
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{ position: "relative", width: "100%" }}
        >
          <video
            ref={videoRef}
            id="viewer"
            muted
            autoPlay
            playsInline
            className="rounded shadow-lg"
            style={{
              width: "100%",
              height: "auto",
              objectFit: "contain",
            }}
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
              {/* Pass speech props to ControlPanel */}
              <ControlPanel speechActive={speechActive} setSpeechActive={setSpeechActive} />
            </Box>
          )}
        </Box>

        {/* Control Panel for larger screens */}
        {!isSmallScreen && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{
              width: "100%",
              marginTop: "auto",
            }}
          >
            {/* Pass speech props to ControlPanel */}
            <ControlPanel speechActive={speechActive} setSpeechActive={setSpeechActive} />
          </Box>
        )}
      </Box>

      {/* Comments Section */}
      <Box
        flex={isSmallScreen ? "none" : "1"}
        sx={{
          width: isSmallScreen ? "100%" : "30%",
          height: isSmallScreen ? "auto" : "100%",
          overflow: "auto",
        }}
      >
        {/* Pass speechActive prop to CommentsField */}
        <CommentsField speechActive={speechActive} />
      </Box>
    </Box>
  );
}
