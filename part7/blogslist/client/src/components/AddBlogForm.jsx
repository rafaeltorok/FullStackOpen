import { useState } from "react";
import { Container, Paper, Button, TextField, Box, Stack } from "@mui/material";

export default function AddBlogForm({ addBlog }) {
  const [newBlog, setNewBlog] = useState({
    title: "",
    author: "",
    url: "",
    likes: 0,
  });

  const createBlog = (event) => {
    event.preventDefault();
    addBlog({
      ...newBlog,
    });
    setNewBlog({ title: "", author: "", url: "", likes: 0 });
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Box
          sx={{
            minHeight: "100px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <form onSubmit={createBlog}>
            <Stack spacing={2}>
              <TextField
                label="Title"
                type="text"
                value={newBlog.title}
                onChange={(e) =>
                  setNewBlog({ ...newBlog, title: e.target.value })
                }
              />
              <TextField
                label="Author"
                type="text"
                value={newBlog.author}
                onChange={(e) =>
                  setNewBlog({ ...newBlog, author: e.target.value })
                }
              />
              <TextField
                label="URL"
                type="text"
                value={newBlog.url}
                onChange={(e) =>
                  setNewBlog({ ...newBlog, url: e.target.value })
                }
              />
              <Button variant="contained" color="primary" type="submit">
                Submit
              </Button>
            </Stack>
          </form>
        </Box>
      </Paper>
    </Container>
  );
}
