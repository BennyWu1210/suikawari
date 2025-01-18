"use client";

import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Paper } from "@mui/material";
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { FixedSizeList, ListChildComponentProps } from 'react-window';

export default function CommentsField() {
  // State to store comments
  const [comments, setComments] = useState<string[]>([
    "Welcome to the chat~",
    "Hello",
    "Spam message",
    "To make the comment",
    "to be longer",
    "hu",
    "hi",
    "ha",
  ]);

  // Reference to FixedSizeList to trigger scroll
  const listRef = useRef<FixedSizeList<any>>(null);

  // Function to scroll to the bottom of the list
  const scrollToBottom = () => {
    listRef.current?.scrollToItem(comments.length, "end");
  };

  // Simulate incoming messages every second (for testing)
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const newComment = `New comment at ${new Date().toLocaleTimeString()}`;
  //     setComments((prevComments) => [...prevComments, newComment]);
  //   }, 1000);

  //   return () => clearInterval(interval); // Cleanup on unmount
  // }, []);

  // Effect to scroll after each comment update
  useEffect(() => {
    if (comments.length > 0) {
      scrollToBottom();
    }
  }, [comments]);

  // Render each row of the list
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

  return (
    <Box sx={{ width: '100vw', height: 300, bgcolor: 'background.paper', position: 'relative',
      overflow: 'hidden', opacity: 1, boxShadow: 2,
        '::-webkit-scrollbar': {
          width: '8px',
        },
        '::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '::-webkit-scrollbar-thumb': {
          background: 'linear-gradient(to top, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 1))', // Gradient fading
          borderRadius: '8px',
        },
     }}>
      <FixedSizeList
        height={300}
        width="100%"
        itemSize={46}
        itemCount={comments.length}
        overscanCount={5}
        ref={listRef}
      >
        {renderRow}
      </FixedSizeList>
    </Box>
  );
}
