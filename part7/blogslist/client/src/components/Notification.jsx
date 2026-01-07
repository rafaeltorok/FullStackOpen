import { Alert, Box, Typography } from "@mui/material";

export default function Notification({ messageType, message }) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        my: 2,
      }}
    >
      <Alert
        severity={messageType}
        sx={{
          width: '100%',
          maxWidth: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          bgcolor:
            messageType === 'success'
              ? 'success.dark'
              : 'error.dark',
          color: 'white',
        }}
      >
        <Typography align="center">
          {message}
        </Typography>
      </Alert>
    </Box>
  );
}
