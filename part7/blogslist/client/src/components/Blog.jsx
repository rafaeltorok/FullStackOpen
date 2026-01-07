import { useParams } from "react-router-dom";
import { useState } from "react";
import { 
  TextField,
  Button,
  Container,
  Paper,
  Box,
  TableContainer,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Table,
  List,
  ListItem,
  ListItemText,
  Typography,
  Link
} from "@mui/material";

export default function Blog({ handleLikes, handleDelete, user, blogById, addComment }) {
  const [newComment, setNewComment] = useState("");
  const { id } = useParams();
  const blog = blogById(id);

  if (!blog) {
    return <h2>Blog not found</h2>;
  }

  const likeBlog = () => {
    handleLikes(blog);
  };

  const removeBlog = () => {
    const confirmRemoval = confirm(
      `Are you sure you want to remove the blog "${blog.title}" by ${blog.author} from the list?`,
    );
    if (confirmRemoval) {
      handleDelete(blog);
    }
  };

  const handleComment = (blogId) => {
    addComment(newComment, blogId);
    setNewComment("");
  }

  return (
    <>
      <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell 
              colSpan={2} 
              align="center"
              sx={{
                fontSize: 'x-large'
              }}
            >
              {blog.title} by {blog.author}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>
              URL
            </TableCell>
            <TableCell>
              <Link
                href={`${blog.url}`}
                style={{ color: 'inherit' }}
              >
                {blog.url}
              </Link>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              Likes
            </TableCell>
            <TableCell>
              <span className="like-count">{blog.likes}</span>
              {user && (
                <Button className="like-button" variant="outlined" sx={{ marginLeft: 2 }} onClick={likeBlog}>
                  like
                </Button>
              )}
            </TableCell>
          </TableRow>
          {user?.username === blog.user?.username && (
            <TableRow>
              <TableCell>
                Added by
              </TableCell>
              <TableCell>   
                <Button type="button" color="error" variant="outlined" onClick={removeBlog}>
                  delete
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
      <h2>Comments:</h2>
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'stretch',
              }}
            >
              <TextField
                label="New comment"
                fullWidth
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />

              <Button
                variant="contained"
                onClick={() => handleComment(id)}
              >
                Add
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
      <div className="comments-section">
        {blog.comments.length > 0 &&
          <List>
            {blog.comments.map(comment => (
              <Paper
                key={comment.id}
                elevation={2}
                sx={{ mb: 2 }}
              >
                <ListItem divider>
                  <ListItemText primary={comment.content} />
                </ListItem>
              </Paper>
            ))}
          </List>
        }
        {blog.comments.length === 0 &&
          <Typography color="text.secondary">
            No comments yet
          </Typography>
        }
      </div>
    </>
  );
}
