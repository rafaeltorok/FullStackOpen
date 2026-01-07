import { Link } from "react-router-dom";
import {
  Paper,
  TableContainer,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Table
} from "@mui/material";

export default function Users({ users }) {
  return (
    <div>
      <h2>Users</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                User
              </TableCell>
              <TableCell>
                Blogs created
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Link 
                    to={`/users/${user.id}`}
                    style={{ color: 'inherit' }}
                  >
                    {user.name}
                  </Link>
                </TableCell>
                <TableCell>
                  {user.blogs.length}
                </TableCell>
            </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}