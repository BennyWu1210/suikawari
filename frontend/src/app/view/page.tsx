"use client";

import { Box, Grid, Typography, Paper } from "@mui/material";
import CommentsField from "../components/CommentsField";
import ControlPanel from "../components/ControlPanel";

export default function ViewPage() {
  return (
    <Box padding={2}>
      <Typography variant="h5" gutterBottom>
        View Screen
      </Typography>

      <Grid container spacing={2}>
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

        {/* Comments Field (Top Right) */}
        <Grid item xs={12} md={6}>
          <CommentsField />
        </Grid>

        {/* Control Panel (Bottom) */}
        <Grid item xs={12}>
          <ControlPanel />
        </Grid>
      </Grid>
    </Box>
  );
}