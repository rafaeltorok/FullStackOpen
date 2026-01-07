import { useParams } from "react-router-dom";
import {
  Paper,
  List,
  ListItem,
  ListItemText
} from '@mui/material';


export default function User({ userById }) {
  const { id } = useParams();
  const user = userById(id);

  if (!user) {
    return <h2>User not found</h2>;
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>Added blogs</h3>
      <List>
        {user.blogs.map(blog => (
          <Paper
            key={blog.id}
            elevation={2}
            sx={{ mb: 2 }}
          >
            <ListItem key={blog.id} divider>
              <ListItemText primary={blog.title} />
            </ListItem>
          </Paper>
        ))}
      </List>
    </div>
  );
}