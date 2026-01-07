import { Alert, Box, Typography } from "@mui/material";

export default function Notification({ messageType, message }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        my: 2,
      }}
    >
      <Alert severity={messageType} sx={{ width: "100%", maxWidth: 600 }}>
        {message}
      </Alert>
    </Box>
  );
}
