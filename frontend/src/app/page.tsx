"use client";

import { Box, Button, Typography, Stack } from "@mui/material";
import Link from "next/link";

export default function Home() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="80vh"
      flexDirection="column"
    >
      <Typography variant="h4" gutterBottom>
        Welcome to the AI Guidance App
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        This app helps a blind user with the next action by scanning real-time video.
      </Typography>
      
      <Stack direction="row" spacing={2}>
        <Link href="/cam">
          <Button variant="contained" color="primary">Open Camera</Button>
        </Link>
        <Link href="/view">
          <Button variant="outlined" color="primary">View Screen</Button>
        </Link>
      </Stack>
    </Box>
  );
}