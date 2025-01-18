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
    <div className="relative z-10 flex mt-5 items-center justify-center">
        <Paper elevation={6} className="relative w-auto m-4 p-4 bg-opacity-20">
        <Box className="flex justify-center items-center w-full h-auto">
          <video
            ref={videoRef}
            muted
            autoPlay
            playsInline
            className="w-full h-auto rounded"
          />
        </Box>
      </Paper>
    </div>
  );
}
