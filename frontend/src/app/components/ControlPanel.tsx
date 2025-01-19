// src/components/ControlPanel.tsx
"use client";

import { Box, IconButton, useTheme } from "@mui/material";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { useState, useEffect, useRef } from "react";
import { initializeSocket } from "../script";

export default function ControlPanel() {
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
  }
  const handleMove = (direction: string) => {
    console.log(`Move: ${direction}`);

    // Emit movement command via socket
    if (socketRef.current) {
      switch(direction) {
        case "forward":
          handleSendComment("move forward")
          break;
        case "backward":
          handleSendComment("move backward")
          break;
        case "left":
          handleSendComment("turn left")
          break;
        case "right":
          handleSendComment("turn right")
          break;
        default:
          // ai logic here
          break;
      }
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
      <Box display="flex" flexDirection="column" alignItems="center">
        {/* Up */}
        <IconButton
          aria-label="forward"
          onClick={() => handleMove("forward")}
          sx={{
            width: 50,
            height: 50,
            backgroundColor: theme.palette.mode === "dark" ? "#505050" : "#dcdcdc",
            ":hover": { backgroundColor: "background.paper" },
          }}
        >
          <ArrowDropUpIcon color="primary" fontSize="large" />
        </IconButton>

        {/* Left, Right */}
        <Box display="flex" justifyContent="center" mt={1}>
          <IconButton
            aria-label="left"
            onClick={() => handleMove("left")}
            sx={{
              width: 50,
              height: 50,
              backgroundColor: theme.palette.mode === "dark" ? "#505050" : "#dcdcdc",
              ":hover": { backgroundColor: "background.paper" },
              mx: 1,
            }}
          >
            <ArrowLeftIcon color="primary" fontSize="large" />
          </IconButton>
          <IconButton
            aria-label="ai"
            onClick={() => handleMove("ai")} // Sending AI command or similar
            sx={{
              width: 50,
              height: 50,
              backgroundColor: theme.palette.mode === "dark" ? "#505050" : "#dcdcdc",
              ":hover": { backgroundColor: "background.paper" },
              mx: 1,
            }}
          >
            <SmartToyIcon color="primary" fontSize="large" />
          </IconButton>
          <IconButton
            aria-label="right"
            onClick={() => handleMove("right")}
            sx={{
              width: 50,
              height: 50,
              backgroundColor: theme.palette.mode === "dark" ? "#505050" : "#dcdcdc",
              ":hover": { backgroundColor: "background.paper" },
              mx: 1,
            }}
          >
            <ArrowRightIcon color="primary" fontSize="large" />
          </IconButton>
        </Box>

        {/* Down */}
        <Box display="flex" justifyContent="center" mt={1}>
          <IconButton
            aria-label="backward"
            onClick={() => handleMove("backward")}
            sx={{
              width: 50,
              height: 50,
              backgroundColor: theme.palette.mode === "dark" ? "#505050" : "#dcdcdc",
              ":hover": { backgroundColor: "background.paper" },
              mx: 1,
            }}
          >
            <ArrowDropDownIcon color="primary" fontSize="large" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
