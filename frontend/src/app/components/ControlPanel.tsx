// src/components/ControlPanel.tsx
"use client";

import { Box, Button } from "@mui/material";

export default function ControlPanel() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      border="1px solid #ccc"
      padding={2}
      borderRadius={1}
      mt={2}
    >
      <Button variant="contained" color="secondary" sx={{ mx: 1 }}>
        Pause
      </Button>
      <Button variant="outlined" color="secondary" sx={{ mx: 1 }}>
        Stop
      </Button>
      <Button variant="contained" color="primary" sx={{ mx: 1 }}>
        Start
      </Button>
    </Box>
  );
}
