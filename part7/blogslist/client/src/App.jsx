import { useState, useEffect, useRef, useReducer } from "react";
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query'
import blogService from "./services/blogService";
import Login from "./components/Login";
import AddBlogForm from "./components/AddBlogForm";
import Notification from "./components/Notification";
import BlogList from "./components/BlogList";
import Togglable from "./components/Togglable";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const blogFormRef = useRef();

  const queryClient = useQueryClient();

  const blogs = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getData
  });

  const initialState = {
    message: '',
    type: ''
  };

  function notificationReducer(state, action) {
    switch (action.type) {
      case 'SHOW':
        return {
          message: action.payload.message,
          type: action.payload.type
        }
      case 'CLEAR':
        return initialState
      default:
        return state
    }
  }

  const [notification, dispatch] = useReducer(
    notificationReducer,
    initialState
  );

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogsListUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

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

      const user = await blogService.userLogin({ username, password });

      window.localStorage.setItem("loggedBlogsListUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
      setNotification(""); // Removes any previous log error notification message after logging in
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
        setUser(null);
      } else {
        window.localStorage.removeItem("loggedBlogsListUser");
        handleNotification("success-message", `${user.name} has logged out`);
        setUser(null);
      }
    } catch (err) {
      console.error(err);
      handleNotification("error-message", "Failed to logout the current user");
    }
  };

  const addBlogMutation = useMutation({
    mutationFn: blogService.storeData,
    onSuccess: (newBlog) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      blogFormRef.current.toggleVisibility();
      dispatch({
        type: 'SHOW',
        payload: {
          message: `The blog "${newBlog.title}" by ${newBlog.author} was added to the list!`,
          type: 'success-message'
        }
      })

      setTimeout(() => {
        dispatch({ type: 'CLEAR' })
      }, 5000)
    },
    onError: () => {
      dispatch({
        type: 'SHOW',
        payload: {
          message: 'Failed to add a new blog',
          type: 'error-message'
        }
      })

      setTimeout(() => {
        dispatch({ type: 'CLEAR' })
      }, 5000)
    }
  });

  const addBlog = (newBlog) => {
    addBlogMutation.mutate(newBlog);
  };

  const updateBlogMutation = useMutation({
    mutationFn: blogService.updateData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
    onError: () => {
      dispatch({
        type: 'SHOW',
        payload: {
          message: `Failed to update the blog's like counter`,
          type: 'error-message'
        }
      })

      setTimeout(() => {
        dispatch({ type: 'CLEAR' })
      }, 5000)
    }
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
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      dispatch({
        type: 'SHOW',
        payload: {
          message: `The blog "${blogToRemove.title}" by ${blogToRemove.author} was removed from the list`,
          type: 'success-message'
        }
      })

      setTimeout(() => {
        dispatch({ type: 'CLEAR' })
      }, 5000)
    },
    onError: () => {
      dispatch({
        type: 'SHOW',
        payload: {
          message: 'Failed to remove blog from the list',
          type: 'error-message'
        }
      })

      setTimeout(() => {
        dispatch({ type: 'CLEAR' })
      }, 5000)
    }
  });

  const handleDelete = async (blogToRemove) => {
    try {
      const isInDatabase = await blogService.getDataById(blogToRemove.id);

      if (isInDatabase) {
        removeBlogMutation.mutate(blogToRemove)
      }
    } catch (err) {
      console.error(err);
    }
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
      {!user && (
        <Login
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
      )}
      {user && (
        <div>
          <p>
            <strong>{user.name}</strong> logged in
            <button onClick={handleLogout}>logout</button>
          </p>
          <Togglable buttonLabel="Add blog" ref={blogFormRef}>
            <AddBlogForm addBlog={addBlog} />
          </Togglable>
        </div>
      )}
      {notification.message && (
        <Notification
          messageType={notification.type}
          message={notification.message}
        />
      )}
      <BlogList
        blogList={blogs.data}
        handleLikes={handleLikes}
        handleDelete={handleDelete}
        user={user}
      />
      <footer>
        Blogs List app, from the FullStackOpen course by MOOC Finland 2025.
      </footer>
    </>
  );
}

export default App;
