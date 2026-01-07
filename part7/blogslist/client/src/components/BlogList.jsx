import { Link } from "react-router-dom";
import {
  Container,
  Card,
  CardContent,
  CardActionArea,
  Typography,
} from "@mui/material";

export default function BlogList({ blogList }) {
  const sortedBlogs = [...blogList].sort((a, b) => b.likes - a.likes);

  return (
    <Container maxWidth="md">
      {sortedBlogs.map((blog) => (
        <Card sx={{ mb: 2 }} key={blog.id}>
          <CardActionArea component={Link} to={`/blogs/${blog.id}`}>
            <CardContent>
              <Typography variant="h6">{blog.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                by {blog.author}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Container>
  );
}
