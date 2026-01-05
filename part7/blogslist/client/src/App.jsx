// APIs and modules
import { useState, useEffect, useRef, useReducer } from "react";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useUserValue, useUserDispatch } from "./context/UserContext";
import {
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate
} from "react-router-dom"

// Services
import loginService from "./services/loginService";
import blogService from "./services/blogService";
import userService from "./services/userService";

// Components
import Home from "./components/Home";
import Login from "./components/Login";
import Notification from "./components/Notification";
import Users from "./components/Users";
import User from './components/User';
import Blog from './components/Blog';

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([]);

  const blogFormRef = useRef();
  const queryClient = useQueryClient();
  const user = useUserValue();
  const dispatchUser = useUserDispatch();
  const navigate = useNavigate();

  const blogs = useQuery({
    queryKey: ["blogs"],
    queryFn: blogService.getData,
  });

  const initialState = {
    message: "",
    type: "",
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.getUsers();
        setUsers(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchUsers();
  }, []);

  function notificationReducer(state, action) {
    switch (action.type) {
      case "SHOW":
        return {
          message: action.payload.message,
          type: action.payload.type,
        };
      case "CLEAR":
        return initialState;
      default:
        return state;
    }
  }

  const [notification, dispatch] = useReducer(
    notificationReducer,
    initialState,
  );

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogsListUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatchUser({ type: "LOGIN", payload: user });
      blogService.setToken(user.token);
    }
  }, []);

  const handleNotification = (messageType, message) => {
    dispatch({
      type: "SHOW",
      payload: {
        message: message,
        type: messageType,
      },
    });

    setTimeout(() => {
      dispatch({ type: "CLEAR" });
    }, 5000);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      if (!username?.trim() || !password?.trim()) {
        handleNotification(
          "error-message",
          "Both username and password are required",
        );
        return;
      }

      const user = await loginService.userLogin({ username, password });

      window.localStorage.setItem("loggedBlogsListUser", JSON.stringify(user));
      blogService.setToken(user.token);
      dispatchUser({ type: "LOGIN", payload: user });
      setUsername("");
      setPassword("");
      handleNotification("success-message", `${user.name} has logged in`);
    } catch (err) {
      console.error(err);
      handleNotification("error-message", "Incorrect credentials");
    }
  };

  const handleLogout = async () => {
    try {
      const isLogged = window.localStorage.getItem("loggedBlogsListUser");
      if (!isLogged) {
        handleNotification("error-message", "User has already been logged out");
        dispatchUser({ type: "LOGOUT" });
      } else {
        window.localStorage.removeItem("loggedBlogsListUser");
        handleNotification("success-message", `${user.name} has logged out`);
        dispatchUser({ type: "LOGOUT" });
      }
    } catch (err) {
      console.error(err);
      handleNotification("error-message", "Failed to logout the current user");
    }
  };

  const addBlogMutation = useMutation({
    mutationFn: blogService.storeData,
    onSuccess: (newBlog) => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      blogFormRef.current.toggleVisibility();
      handleNotification(
        "success-message",
        `The blog "${newBlog.title}" by ${newBlog.author} was added to the list!`,
      );
    },
    onError: () => {
      handleNotification("error-message", "Failed to add a new blog");
    },
  });

  const addBlog = (newBlog) => {
    addBlogMutation.mutate(newBlog);
  };

  const updateBlogMutation = useMutation({
    mutationFn: blogService.updateData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
    onError: () => {
      handleNotification(
        "error-message",
        "Failed to update the blog's like counter",
      );
    },
  });

  const handleLikes = async (blogToUpdate) => {
    const updatedBlog = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1,
    };

    updateBlogMutation.mutate(updatedBlog);
  };

  const removeBlogMutation = useMutation({
    mutationFn: (blogToRemove) => blogService.removeData(blogToRemove.id),
    onSuccess: (_, blogToRemove) => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      handleNotification(
        "success-message",
        `The blog "${blogToRemove.title}" by ${blogToRemove.author} was removed from the list`,
      );
      navigate('/');
    },
    onError: () => {
      handleNotification(
        "error-message",
        "Failed to remove blog from the list",
      );
    },
  });

  const handleDelete = async (blogToRemove) => {
    try {
      const isInDatabase = await blogService.getDataById(blogToRemove.id);

      if (isInDatabase) {
        removeBlogMutation.mutate(blogToRemove);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const userById = (id) => {
    return users.find(u => u.id === id) || null;
  };

  const blogById = (id) => {
    return blogs.data.find(b => b.id === id) || null;
  };

  const padding = {
    padding: 5,
  };

  if (blogs.isError) {
    return <h2>Failed to get data from the server</h2>;
  }

  if (blogs.isLoading) {
    return <h2>Loading data, please wait...</h2>;
  }

  return (
    <>
      <h1 className="main-title">Blogs List</h1>
      <div className="navbar">
        <Link style={padding} to="/">home</Link>
        <Link style={padding} to="/users">users</Link>
        {user && (
          <div>
            <p>
              <strong>{user.name}</strong> logged in
              <button onClick={handleLogout}>logout</button>
            </p>
          </div>
        )}
      </div>

      {notification.message && (
        <Notification
          messageType={notification.type}
          message={notification.message}
        />
      )}

      <Routes>
        <Route 
          path="/"
          element={
            user
              ?
              <Home
                blogFormRef={blogFormRef}
                addBlog={addBlog}
                blogs={blogs}
              /> 
              : <Navigate replace to="/login" />
          }
        />
        <Route 
          path="/users" 
          element={
            user
              ? <Users users={users} />
              : <Navigate replace to="/login" />
          }
        />
        <Route
          path="/login"
          element={
            user
              ? <Navigate to="/" replace />
              : <Login
                  handleLogin={handleLogin}
                  username={username}
                  setUsername={setUsername}
                  password={password}
                  setPassword={setPassword}
                />
          }
        />
        <Route path='/users/:id' element={<User userById={userById} />} />
        <Route 
          path='/blogs/:id'
          element={
            <Blog
              handleLikes={handleLikes}
              handleDelete={handleDelete}
              user={user}
              blogById={blogById}
            />
          }
        />
      </Routes>

      <footer>
        Blogs List app, from the FullStackOpen course by MOOC Finland 2025.
      </footer>
    </>
  );
}

export default App;
