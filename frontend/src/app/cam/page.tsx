"use client";

import { Box, Typography } from "@mui/material";
import VideoPlayer from "../components/VideoPlayer";

export default function CamPage() {
  return (
    <Box padding={2}>
      <Typography variant="h5" gutterBottom>
        Camera
      </Typography>
      <Box
        border="1px solid #ccc"
        borderRadius="4px"
        padding={2}
        display="flex"
        justifyContent="center"
      >
        <VideoPlayer />
      </Box>
    </Box>
  );
}