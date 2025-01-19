"use client";

import { Box, IconButton, useTheme } from "@mui/material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import BackHandIcon from '@mui/icons-material/BackHand';
import { useState, useEffect, useRef } from "react";
import { initializeSocket } from "@/util/script";

interface ControlPanelProps {
  speechActive: boolean;
  setSpeechActive: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ControlPanel({ speechActive, setSpeechActive }: ControlPanelProps) {
  const [comments, setComments] = useState<string[]>([]);
  const theme = useTheme();
  const socketRef = useRef<any>(null);

  // Initialize socket on component mount
  useEffect(() => {
    const socket = initializeSocket();
    socketRef.current = socket;

    // Request initial comments
    socket.emit("getComments");

    // Listen for new comment broadcast
    socket.on("comment", (comment: string) => {
      setComments((prev) => [...prev, comment]);
    });

    return () => {
      socket.off("comment");
    };
  }, []);

  const handleSendComment = (commentText: string) => {
    socketRef.current.emit("comment", commentText);
  };

  const handleMove = (direction: string) => {
    console.log(`Move: ${direction}`);

    if (socketRef.current) {
      switch (direction) {
        case "forward":
          handleSendComment("move forward");
          break;
        case "backward":
          handleSendComment("move backward");
          break;
        case "left":
          handleSendComment("turn left");
          break;
        case "right":
          handleSendComment("turn right");
          break;
        case "stop":
          handleSendComment("STOP!");
            break;
        default:
          break;
      }
    }
  };

  // Common styling for icon buttons
  const buttonStyle = {
    width: 50,
    height: 50,
    backgroundColor: theme.palette.mode === "dark" ? "#505050" : "#dcdcdc",
    ":hover": { backgroundColor: "background.paper" },
    m: 0.5,
  };

  return (
    <Box display="flex" alignItems="center" gap={4} marginTop={2} sx={{
      flexDirection: { xs: "column", md: "row" }, 
    }}>
      {/* Directional control buttons */}
      <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
        <IconButton aria-label="forward" onClick={() => handleMove("forward")} sx={buttonStyle}>
          <ArrowDropUpIcon color="primary" fontSize="large" />
        </IconButton>
        <Box display="flex" justifyContent="center" gap={1}>
          <IconButton aria-label="left" onClick={() => handleMove("left")} sx={buttonStyle}>
            <ArrowLeftIcon color="primary" fontSize="large" />
          </IconButton>
          <IconButton aria-label="stop" onClick={() => handleMove("stop")} sx={buttonStyle}>
            <BackHandIcon color="primary" fontSize="large" />
          </IconButton>
          <IconButton aria-label="right" onClick={() => handleMove("right")} sx={buttonStyle}>
            <ArrowRightIcon color="primary" fontSize="large" />
          </IconButton>
        </Box>
        <IconButton aria-label="backward" onClick={() => handleMove("backward")} sx={buttonStyle}>
          <ArrowDropDownIcon color="primary" fontSize="large" />
        </IconButton>
      </Box>

      <IconButton aria-label="ai" onClick={() => handleMove("stop")} sx={buttonStyle}>
        <SmartToyIcon color="primary" fontSize="medium" />
      </IconButton>
      
      {/* Voice toggle button */}
      <IconButton
        aria-label="toggle-speech"
        onClick={() => setSpeechActive(!speechActive)}
        sx={buttonStyle}
      >
        {speechActive ? (
          <VolumeUpIcon color="primary" fontSize="large" />
        ) : (
          <VolumeOffIcon color="primary" fontSize="large" />
        )}
      </IconButton>
    </Box>
  );
}
