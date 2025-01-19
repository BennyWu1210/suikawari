// src/lib/theme.ts
"use client";

import { createTheme } from "@mui/material/styles";

/**
 * Light Theme
 */
export const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#f0e7db", // bg.DEFAULT._light
      paper: "#f8f4ef", // bg.subtle._light
    },
    text: {
      primary: "#1a202c", // fg.DEFAULT._light
      secondary: "#4a5568", // fg.subtle._light
      disabled: "#718096", // fg.muted._light
    },
    divider: "#e2e8f0", // border.DEFAULT._light
  },
  typography: {
    // Example typography settings
    fontFamily: "BlinkMacSystemFont, sans-serif",
  },
});

/**
 * Dark Theme
 */
export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#1B202B", // bg.DEFAULT._dark
      paper: "#2a2f3a", // bg.subtle._dark
    },
    text: {
      primary: "#e2e8f0", // fg.DEFAULT._dark
      secondary: "#a0aec0", // fg.subtle._dark
      disabled: "#718096", // fg.muted._dark
    },
    divider: "#2d3748", // border.DEFAULT._dark
  },
  typography: {
    fontFamily: "BlinkMacSystemFont, sans-serif",
  },
});
