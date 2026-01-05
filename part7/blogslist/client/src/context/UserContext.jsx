import { createContext, useReducer, useContext, useEffect } from "react";
import blogService from "../services/blogService";

const UserContext = createContext();
const UserDispatchContext = createContext();

const userReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return action.payload;
    case "LOGOUT":
      return null;
    default:
      return state;
  }
};

export const UserProvider = ({ children }) => {
  const [user, dispatch] = useReducer(userReducer, null);

  useEffect(() => {
    const loggedUserJSON = localStorage.getItem("loggedBlogsListUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch({ type: "LOGIN", payload: user });
      blogService.setToken(user.token);
    }
  }, []);

  return (
    <UserContext.Provider value={user}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
};

export const useUserValue = () => {
  return useContext(UserContext);
};

export const useUserDispatch = () => {
  return useContext(UserDispatchContext);
};
