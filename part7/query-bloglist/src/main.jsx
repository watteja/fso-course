import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "./UserContext";
import { NotificationProvider } from "./NotificationContext";
import { Container } from "@mui/material";
import App from "./App";
import "./index.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <NotificationProvider>
          <Container>
            <App />
          </Container>
        </NotificationProvider>
      </UserProvider>
    </QueryClientProvider>
  </Router>
);
