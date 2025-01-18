// src/components/CommentsField.tsx
"use client";

import { Box, Typography, Paper } from "@mui/material";
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { FixedSizeList, ListChildComponentProps } from 'react-window';

function renderRow(props: ListChildComponentProps) {
  const { index, style } = props;

  return (
    <ListItem style={style} key={index} component="div" disablePadding>
      <ListItemButton>
        <ListItemText primary={`Item ${index + 1}`} />
      </ListItemButton>
    </ListItem>
  );
}

export default function CommentsField() {
  return (
    <Box
      sx={{ width: '100vw', height: 300, bgcolor: 'background.paper' }}
    >
      <FixedSizeList
        height={300}
        width="100%"
        itemSize={46}
        itemCount={200}
        overscanCount={5}
      >
        {renderRow}
      </FixedSizeList>
    </Box>
  );
  // return (
  //   <Paper
  //     elevation={2}
  //     sx={{
  //       height: 300,
  //       padding: 2,
  //       overflowY: "auto",
  //     }}
  //   >
  //     <Typography variant="h6">AI Comments</Typography>
  //     <Box mt={1}>
  //       <Typography variant="body2">
  //         1. Please move two steps forward.
  //       </Typography>
  //       <Typography variant="body2">
  //         2. Watch out for obstacle on the left.
  //       </Typography>
  //       <Typography variant="body2">
  //         3. Turn your head slightly to the right for a better view.
  //       </Typography>
  //     </Box>
  //   </Paper>
  // );
}
