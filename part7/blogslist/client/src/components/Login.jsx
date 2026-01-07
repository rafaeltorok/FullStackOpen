import { 
  TextField,
  Button,
  Container,
  Paper,
  Box,
  Stack
} from "@mui/material";


export default function Login({
  handleLogin,
  username,
  setUsername,
  password,
  setPassword,
}) {
  return (
    <>
      <h2>Login</h2>
      <Container maxWidth="sm">
        <Box
          sx={{
            minHeight: '100px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Paper elevation={3} sx={{ padding: 3 }}>
            <form onSubmit={handleLogin}>
              <Stack spacing={2}>
                <TextField
                  label="Username" 
                  type="text"
                  value={username}
                  onChange={({ target }) => setUsername(target.value)}
                />
                <TextField 
                  label="Password" 
                  type="password"
                  value={password}
                  onChange={({ target }) => setPassword(target.value)}
                />
                <Button variant="contained" color="primary" type="submit">
                  login
                </Button>
              </Stack>
            </form>
          </Paper>
        </Box>
      </Container>
    </>
  );
}
