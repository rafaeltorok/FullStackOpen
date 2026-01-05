import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import "./index.css";
import App from "./App.jsx";
import { UserProvider } from "./context/UserContext.jsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <UserProvider>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </UserProvider>
);
