"use client";

import React, { useState, useEffect, useRef, KeyboardEvent } from "react";
import {
  Box,
  TextField,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import { initializeSocket } from "../script";

interface FadeInSectionProps {
  children: React.ReactNode;
}

function FadeInSection({ children }: FadeInSectionProps) {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => setVisible(entry.isIntersecting));
    });
    if (domRef.current) observer.observe(domRef.current);
    return () => {
      if (domRef.current) observer.unobserve(domRef.current);
    };
  }, []);

  return (
    <div
      className="fade-in-section"
      ref={domRef}
      style={{
        opacity: isVisible ? 1 : 0,
        transition: "opacity 1s ease-in-out",
      }}
    >
      {children}
    </div>
  );
}

export default function CommentsField() {
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [listHeight, setListHeight] = useState<number>(0);

  const listRef = useRef<FixedSizeList<any>>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<any>(null);

  // Initialize Socket and listeners
  useEffect(() => {
    const socket = initializeSocket();
    socketRef.current = socket;

    socket.emit("getComments");
    socket.on("comments", (initialComments: string[]) => {
      setComments(initialComments);
    });
    // Request initial comments
    socket.emit("getComments");

    // Listen for initial comments response
    socket.on("comments", (initialComments: string[]) => {
      setComments(initialComments);
    });

    // Listen for new comment broadcast
    socket.on("comment", (comment: string) => {
      setComments((prev) => [...prev, comment]);
    });

    return () => {
      socket.off("comments");
      socket.off("comment");
    };
  }, []);

  // Measure height of the list container
  useEffect(() => {
    if (containerRef.current) {
      setListHeight(containerRef.current.clientHeight);
    }
    // Optionally, update height on window resize
    const handleResize = () => {
      if (containerRef.current) {
        setListHeight(containerRef.current.clientHeight);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-scroll to latest comment whenever comments change
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollToItem(comments.length, "end");
    }
    var msg = new SpeechSynthesisUtterance();
    msg.text = comments[comments.length - 1];
    window.speechSynthesis.speak(msg);
  }, [comments]);

  const handleSendComment = () => {
    if (newComment.trim() === "") return;
    const commentText = newComment.trim();
    socketRef.current.emit("comment", commentText);
    setNewComment("");
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendComment();
    }
  };

  const renderRow = (props: ListChildComponentProps) => {
    const { index, style } = props;
    return (
      <ListItem style={style} key={index} component="div" disablePadding>
        <ListItemButton>
          <ListItemText primary={comments[index]} />
        </ListItemButton>
      </ListItem>
    );
  };

  const isLargeScreen = useMediaQuery("(min-width:1024px)");
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  const containerHeight = isLargeScreen ? "87vh" : isSmallScreen ? "50vh" : "60vh";

  return (
    <FadeInSection>
    <Box
      sx={{
        width: "100%",
        // height: "85vh", // total height for the container
        height: containerHeight,
        bgcolor: "transparent",
        borderRadius: 2,
        boxShadow: 2,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        paddingY: 2
      }}
    >
    {/* Container for measuring list height */}
    <Box ref={containerRef} sx={{ flex: 1, overflow: "hidden" }}>
      {listHeight > 0 && (
        <FixedSizeList
          height={listHeight}   // use measured height
          width="100%"
          itemSize={46}
          itemCount={comments.length}
          overscanCount={15}
          ref={listRef}
        >
          {renderRow}
        </FixedSizeList>
      )}
    </Box>

    {/* Fixed-height Comment Input Field */}
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        borderTop: "1px solid #ccc",
        padding: "4px",
        height: 50,
        backgroundColor: "transparent",
        flexShrink: 0,
      }}
    >
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Add a public comment..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        onKeyPress={handleKeyPress}
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              border: "none", // Remove the outline
            },
            "&:hover fieldset": {
              border: "none", // Remove the outline on hover
            },
            "&.Mui-focused fieldset": {
              border: "none", // Remove the outline when focused
            },
          },
        }}
      />
      <IconButton
        color="primary"
        aria-label="send"
        onClick={handleSendComment}
        disabled={!newComment.trim()}
      >
        <SendIcon />
      </IconButton>
    </Box>
  </Box>
</FadeInSection>

  );
}