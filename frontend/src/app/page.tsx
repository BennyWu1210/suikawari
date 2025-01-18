"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import NextLink from "next/link";
import { Button, ButtonGroup, useTheme, useMediaQuery } from "@mui/material";

export default function Page() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const newSocket = io("http://localhost:5000", {
      transports: ["websocket", "polling"],
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to Python SocketIO server! ID =", newSocket.id);
    });

    newSocket.on("requestForOffer", (viewerId: string) => {
      console.log("Server wants an offer for viewer:", viewerId);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <main className="relative flex flex-col items-center justify-start h-screen pt-28 z-10"
      style={{
        padding: isSmallScreen ? "1rem" : "2rem",
        textAlign: "center",
      }}>
      {/* Title */}
      <h1 className="font-bold mb-8" 
        style={{
          fontSize: isSmallScreen ? "2.5rem" : "4rem",
        }}>I AM</h1>

      {/* Button group */}
      <ButtonGroup variant="text" aria-label="Large button group" orientation={isSmallScreen ? "vertical" : "horizontal"}>
        {/* <Button
          sx={{
            fontSize: "1.5rem",
            padding: "1rem 2.5rem",
            textTransform: "none",
            color: "white",
            transition: "background 0.3s, color 0.3s",
            "&:hover": {
              background: "linear-gradient(to right, #3b47a3, #6b6ee8)", // Darker purple-to-blue gradient
              color: "white",
            },
          }}
        >
          <NextLink
            href="/cam"
            style={{ color: "inherit", textDecoration: "none" }}
          >
            Camera
          </NextLink>
        </Button> */}
        <Button
          sx={{
            fontSize: isSmallScreen ? "1rem" : "1.5rem",
            padding: isSmallScreen ? "0.5rem 1.5rem" : "1rem 2.5rem",
            textTransform: "none",
            color: theme.palette.mode === "dark" ? "white" : "black",
            transition: "background 0.3s, color 0.3s",
            backgroundColor: "rgba(0, 0, 0, 0)",
            "&:hover": {
              background: "linear-gradient(to right, rgba(217, 78, 106, 0.8), rgba(217, 83, 121, 0.8))", // Darker pink-to-red gradient
              color: "white",
            },
          }}
        >
          <NextLink
            href="/view"
            style={{ color: "inherit", textDecoration: "none" }}
          >
            Watcher
          </NextLink>
        </Button>
      </ButtonGroup>
    </main>
  );
}
