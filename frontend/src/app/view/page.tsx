"use client";

import { Box, Grid, Typography, Paper } from "@mui/material";
import CommentsField from "../components/CommentsField";
import ControlPanel from "../components/ControlPanel";

export default function ViewPage() {
  return (
    <Box padding={2} 
      sx={{
      display: "flex", // Use flexbox layout
      flexDirection: "column", // Stack items vertically
      minHeight: "100vh", // Ensure it fills the full height of the screen
    }}>
      <Typography variant="h5" gutterBottom>
        View Screen
      </Typography>

      <Grid container spacing={2} sx={{ flex: 1 }}>
        {/* Screen (Top Left) */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={2}
            sx={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <Typography variant="body1">
              {/* This could be a live feed snapshot or any representation */}
              Screen Display Area
            </Typography>
          </Paper>
        </Grid>

        {/* Control Panel (Top Right) */}
        <Grid item xs={12} md={6} display="flex" alignItems="center" justifyContent="center">
          <ControlPanel />
        </Grid>

        {/* Comment Field (Bottom) */}
        <Grid item xs={12}>
          <CommentsField />
        </Grid>
      </Grid>
    </Box>
  );
}