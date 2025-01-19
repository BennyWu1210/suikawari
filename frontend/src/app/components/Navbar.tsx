"use client";

import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { usePathname } from "next/navigation";
import NextLink from "next/link";

interface NavbarProps {
  themeMode: "light" | "dark";
  toggleTheme: () => void;
}

export default function Navbar({ themeMode, toggleTheme }: NavbarProps) {
  const path = usePathname();
  return (
    <div className="relative pt-6 px-4 z-50">
      {/* Rounded Navbar */}
      <AppBar
        position="static"
        className={`rounded-full w-3/4 mx-auto bg-opacity-20 ${
          themeMode === "dark" ? "bg-gray-900" : "bg-indigo-300"
        } shadow-md`}
      >
        <Toolbar className="flex justify-between items-center px-7">
          {/* Title */}
          <NextLink href="/">
          <Typography
            variant="h6"
            component="div"
            sx={{
              color: themeMode === "dark" ? "white" : "black",
              transition: "color 0.3s",
            }}
          >
             🍉 Suikawari      
          </Typography>
          </NextLink>       
          {/* {path !== '/' && <NextLink href="/"> Back to Home </NextLink>} */}
          <IconButton
            edge="end"
            onClick={toggleTheme}
            className={`transition ${
              themeMode === "dark" ? "text-yellow-50" : "text-gray-700"
            }`}
          >
            {themeMode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}
