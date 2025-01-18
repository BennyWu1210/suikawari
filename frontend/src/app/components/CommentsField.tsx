// src/components/CommentsField.tsx
"use client";

import { Box, Typography, Paper } from "@mui/material";

export default function CommentsField() {
  return (
    <Paper
      elevation={2}
      sx={{
        height: 300,
        padding: 2,
        overflowY: "auto",
      }}
    >
      <Typography variant="h6">AI Comments</Typography>
      <Box mt={1}>
        <Typography variant="body2">
          1. Please move two steps forward.
        </Typography>
        <Typography variant="body2">
          2. Watch out for obstacle on the left.
        </Typography>
        <Typography variant="body2">
          3. Turn your head slightly to the right for a better view.
        </Typography>
      </Box>
    </Paper>
  );
}
