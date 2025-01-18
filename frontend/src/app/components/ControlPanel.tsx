// src/components/ControlPanel.tsx
"use client";

import { Box, Button } from "@mui/material";
import { useEffect } from "react";
import { getSocket } from "../components/socket";

export default function ControlPanel() {
  "use client";

  useEffect(() => {
    const socket = getSocket();

    socket.on("connect", () => {
      console.log("Connected to Python server:", socket.id);
    });

    // Cleanup if needed
    return () => {
      socket.off("connect");
      // Do not call socket.disconnect() globally unless you want to close it altogether
    };
  }, []);

  // ...

  return (
    <Box
      display="flex"
      justifyContent="center"
      border="1px solid #ccc"
      padding={2}
      borderRadius={1}
      mt={2}
    >
      <Button variant="contained" color="secondary" sx={{ mx: 1 }}>
        Pause
      </Button>
      <Button variant="outlined" color="secondary" sx={{ mx: 1 }}>
        Stop
      </Button>
      <Button variant="contained" color="primary" sx={{ mx: 1 }}>
        Start
      </Button>
    </Box>
  );
}
