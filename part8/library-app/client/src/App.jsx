import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Notify from "./components/Notify";
import Login from "./components/Login";
import Recommendations from "./components/Recommendations";
import { 
  LOGIN_USER, 
  ME, 
  ALL_AUTHORS, 
  ALL_BOOKS, 
  AUTHOR_ADDED, 
  BOOK_ADDED 
} from "./graphql/queries";
import { 
  useMutation, 
  useQuery, 
  useApolloClient, 
  useSubscription 
} from "@apollo/client/react";
import { 
  Routes, 
  Route, 
  Link, 
  Navigate, 
  useNavigate 
} from "react-router-dom";
import { addAuthorToCache, addBookToCache } from "./utils/apolloCache";

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [user, setUser] = useState(
    window.localStorage.getItem("library-user-token"),
  );

  const client = useApolloClient();

  const navigate = useNavigate();

  useSubscription(AUTHOR_ADDED, {
    onData: ({ data }) => {
      const addedAuthor = data.data.authorAdded;
      addAuthorToCache(client.cache, addedAuthor);
      console.log(data);
    }
  });

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded;
      addBookToCache(client.cache, addedBook);
      console.log(data);
    }
  });

  const handleLogin = (username, password) => {
    login({ variables: { username, password } });
  };

  const handleLogout = async () => {
    window.localStorage.removeItem("library-user-token");
    setUser(null);
    await client.resetStore();
    navigate("/");
  };

  const padding = {
    padding: 5,
  };

  const notify = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 10000);
  };

  const [login] = useMutation(LOGIN_USER, {
    onCompleted: async (data) => {
      const token = data.login.value;
      setUser(token);
      localStorage.setItem("library-user-token", token);
      await client.resetStore(); // Forces it to re-fetch the correct username via the me query
      navigate("/");
    },
    onError: (error) => notify(error.message),
  });

  const { data, loading } = useQuery(ME, {
    skip: !user,
  });

  return (
    <div>
      <div>
        {user ? (
          <Link style={padding} to={"/"}>
            add book
          </Link>
        ) : (
          <Link style={padding} to="/login">
            login
          </Link>
        )}
        <Link style={padding} to={"/authors"}>
          authors
        </Link>
        <Link style={padding} to={"/books"}>
          books
        </Link>
        {user && data?.me && (
          <Link style={padding} to={"/recommendations"}>
            recommendations
          </Link>
        )}
        {user && (
          <em>
            {loading ? "User" : data?.me?.username} logged in
            <button onClick={handleLogout}>Logout</button>
          </em>
        )}
      </div>

      <Notify errorMessage={errorMessage} />

      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <NewBook setError={notify} />
            ) : (
              <Navigate replace to="/login" />
            )
          }
        />
        <Route
          path="/authors"
          element={<Authors setError={notify} user={user} />}
        />
        <Route
          path="/books"
          element={<Books setError={notify} user={user} />}
        />
        <Route
          path="/recommendations"
          element={
            !user ? (
              <Navigate replace to="/books" />
            ) : loading ? (
              <div>Loading recommendations...</div>
            ) : (
              <Recommendations favoriteGenre={data.me.favoriteGenre} />
            )
          }
        />
        <Route
          path="/login"
          element={<Login setError={notify} login={handleLogin} />}
        />
      </Routes>
    </div>
  );
};

export default App;
