"use client";

import { useState } from "react";
import { ReactNode } from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Navbar from "./components/Navbar";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  const [themeMode, setThemeMode] = useState<"light" | "dark">("dark");

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const theme = createTheme({
    palette: {
      mode: themeMode,
      primary: {
        main: themeMode === "dark" ? "#90caf9" : "#1976d2",
      },
    },
  });

  return (
    <html lang="en" className={themeMode}>
      <body
        className={`transition-colors relative min-h-screen overflow-hidden ${
          themeMode === "dark" ? "text-gray-50" : "text-gray-900"
        }`}
      >
        {/* Background */}
        {themeMode === "dark" ? (
          // Dark Background
          <>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-bl from-gray-900 via-gray-800 to-black z-0"></div>
            <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-full filter blur-3xl opacity-50 z-0"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-gradient-to-br from-pink-500 via-red-400 to-orange-400 rounded-full filter blur-3xl opacity-50 z-0"></div>
          </>
        ) : (
          // Light Background
          <>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-bl from-white via-gray-200 to-blue-100 z-0"></div>
            <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-purple-400 via-blue-500 to-green-300 rounded-full filter blur-3xl opacity-50 z-0"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-gradient-to-br from-orange-400 via-red-400 to-pink-300 rounded-full filter blur-3xl opacity-50 z-0"></div>
          </>
        )}

        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="relative z-10">
            <Navbar themeMode={themeMode} toggleTheme={toggleTheme} />
          </div>

          {/* Content */}
          <div className="relative z-10">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
