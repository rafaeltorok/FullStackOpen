import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Notify from "./components/Notify";
import { Routes, Route, Link } from "react-router-dom";

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null);

  const padding = {
    padding: 5,
  };

  const notify = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 10000);
  };

  return (
    <div>
      <div>
        <Link style={padding} to={"/"}>
          add book
        </Link>
        <Link style={padding} to={"/authors"}>
          authors
        </Link>
        <Link style={padding} to={"/books"}>
          books
        </Link>
      </div>

      <Notify errorMessage={errorMessage} />

      <Routes>
        <Route path="/" element={<NewBook setError={notify} />} />
        <Route path="/authors" element={<Authors setError={notify} />} />
        <Route path="/books" element={<Books />} />
      </Routes>
    </div>
  );
};

export default App;
