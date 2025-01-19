"use client";

import React, { useEffect, useRef, useState } from "react";
import { Box, Paper, Button } from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { camera } from "../../util/script.js";

export default function CamPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [audioData, setAudioData] = useState("");

  useEffect(() => {
    async function initializeCamera() {
      console.log("Setting up camera...");
      const socket = await camera();


      // on socket.io processResult console log the result
      socket.on("processResult", (data: any) => {
        console.log(data);
        setAudioData(data);
        // var msg = new SpeechSynthesisUtterance();
        // msg.text = data.result;
        // window.speechSynthesis.speak(msg);
        var msg = new SpeechSynthesisUtterance();
        msg.rate = 1.1; // Speed of speech
        msg.pitch = 1.1; // Pitch of voice
        msg.volume = 1; // Volume level
        msg.text = data.result;
        window.speechSynthesis.speak(msg);
      });
    }
    initializeCamera();
  }, []);

  useEffect(() => {
    if (audioEnabled) {
      const handleSpeak = () => {
        const msg = new SpeechSynthesisUtterance();
        msg.text = audioData
        window.speechSynthesis.speak(msg);

        msg.onend = () => {
          // Trigger re-render to process next comment in the queue
          handleSpeak();
        };
        
      };

      // Start speaking whenever the queue updates
      handleSpeak();
    }
  }, [audioEnabled]);

  // Enable audio with user interaction for iOS compatibility
  const enableAudio = () => {
    const silentUtterance = new SpeechSynthesisUtterance("hello");
    silentUtterance.volume = 0; // Silent speech
    window.speechSynthesis.speak(silentUtterance);
    setAudioEnabled(true);
    console.log("Speech Synthesis API enabled.");
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
        <Box className="flex justify-center items-center w-full h-auto">
          <video
            ref={videoRef}
            id="camera"
            muted
            autoPlay
            playsInline
            className="w-full h-auto rounded shadow-lg"
          />
          <canvas id="canvas" />
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
