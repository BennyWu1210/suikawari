'use client';

import React, { useEffect, useRef, useState } from "react";
import { Box, Paper, Button } from "@mui/material";
import { setupCamera, apex } from "../../util/script.js";
import { initializeSocket } from "@/util/script";

export default function ApexPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const socketRef = useRef<any>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [commentQueue, setCommentQueue] = useState<string[]>([]);

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

    // Listen for comments from the server
    socket.on("comment", (comment: string) => {
      setCommentQueue((prevQueue) => [...prevQueue, comment]);
    });

    return () => {
      socket.off("comment");
    };
  }, []);

  const handleSpeak = () => {
    if (commentQueue.length > 0) {
      const msg = new SpeechSynthesisUtterance();
      msg.text = commentQueue.shift()!;
      window.speechSynthesis.speak(msg);

      msg.onend = () => {
        // Trigger re-render to process next comment in the queue
        setCommentQueue((prevQueue) => [...prevQueue]);
        handleSpeak();
      };
    }
  };

  const enableAudio = () => {
    setAudioEnabled(true);

    // Process the queue if there are comments
    if (commentQueue.length > 0) {
      handleSpeak();
    }
  };

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
        <Box className="flex flex-col justify-center items-center w-full h-auto">
          <video
            ref={videoRef}
            id="camera"
            muted
            autoPlay
            playsInline
            className="w-full h-auto rounded shadow-lg"
          />
          {!audioEnabled && (
            <Button
              variant="contained"
              color="primary"
              sx={{ marginTop: "16px" }}
              onClick={enableAudio}
            >
              Enable Audio
            </Button>
          )}
        </Box>
      </Paper>
    </div>
  );
}
