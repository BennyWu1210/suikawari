"use client";

import React, { useEffect, useRef } from "react";
import { Box, Paper, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

export default function CamPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error("getUserMedia is not supported in this browser.");
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current
            .play()
            .catch((err) => console.error("Error trying to play the video:", err));
        }
      })
      .catch((err) => {
        console.error("Error accessing the camera:", err);
      });

    // Cleanup: stop camera when unmounting
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const handleBackToMain = () => {
    router.push("/");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-25">
        <Button
          variant="contained"
          color="primary"
          startIcon={<KeyboardBackspaceIcon />}
          onClick={handleBackToMain}
          className="absolute top-4 right-7"
        >
          Back to Home
        </Button>
        <Paper elevation={6} className="relative w-auto m-4 p-4">
        <Box className="flex justify-center items-center w-full h-full mt-12">
          <video
            ref={videoRef}
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
