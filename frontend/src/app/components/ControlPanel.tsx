// src/components/ControlPanel.tsx
"use client";

import { Box, Button, IconButton, useTheme } from "@mui/material";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { useEffect } from "react";
import { getSocket } from "../components/socket";

export default function ControlPanel() {
  "use client";

  const theme = useTheme();

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
  const handleMove = (direction: string) => {
    console.log(`Move: ${direction}`);

    const socket = getSocket();
    socket.emit("move", { direction });
  };

  return (
    // <Box
    //   display="flex"
    //   justifyContent="center"
    //   border="1px solid #ccc"
    //   padding={2}
    //   borderRadius={1}
    //   mt={2}
    // >
    //   <Button variant="contained" color="secondary" sx={{ mx: 1 }}>
    //     Pause
    //   </Button>
    //   <Button variant="outlined" color="secondary" sx={{ mx: 1 }}>
    //     Stop
    //   </Button>
    //   <Button variant="contained" color="primary" sx={{ mx: 1 }}>
    //     Start
    //   </Button>
    // </Box>
    <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
      <Box display="flex" flexDirection="column" alignItems="center">
        {/* Up */}
        <IconButton
          aria-label="up"
          onClick={() => handleMove("up")}
          sx={{
            width: 50,
            height: 50,
            backgroundColor: theme.palette.mode === "dark" ? "#505050" : "#dcdcdc",
            ":hover": { backgroundColor: "background.paper" },
          }}
        >
          <ArrowDropUpIcon color="primary" fontSize="large" />
        </IconButton>

        {/* Left, AI, Right */}
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
            onClick={() => handleMove("")} // not sure 
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
            aria-label="down"
            onClick={() => handleMove("down")}
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

      {/* Other buttons below */}
      {/* <Box
        display="flex"
        justifyContent="center"
        border="1px solid #ccc"
        padding={2}
        borderRadius={1}
        mt={2}
        gap={2}
      >
        <Button variant="contained" color="secondary">
          Pause
        </Button>
        <Button variant="outlined" color="secondary">
          Stop
        </Button>
        <Button variant="contained" color="primary">
          Start
        </Button>
      </Box> */}
    </Box>
  );
}
