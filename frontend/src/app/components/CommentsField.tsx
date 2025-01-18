"use client";

import React, { useState, useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { FixedSizeList, ListChildComponentProps } from "react-window";

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

  const listRef = useRef<FixedSizeList<any>>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const newComment = `New comment at ${new Date().toLocaleTimeString()}`;
      setComments((prev) => [...prev, newComment]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollToItem(comments.length, "end");
    }
  }, [comments]);

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
    <FadeInSection>
      <Box
        sx={{
          width: "100vw",
          height: 300,
          bgcolor: "background.paper",
          position: "relative",
          overflow: "hidden",
          opacity: 0.8,
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
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
    </FadeInSection>
  );
}
