import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "./UserContext";
import { NotificationProvider } from "./NotificationContext";
import { Container, ThemeProvider, createTheme } from "@mui/material";
import App from "./App";
import "./index.css";
import { amber, blue, lightBlue } from "@mui/material/colors";

const queryClient = new QueryClient();

const theme = createTheme({
  palette: {
    primary: blue,
    secondary: lightBlue,
    warning: amber,
  },

  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: "none",
          color: "whitesmoke",
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <NotificationProvider>
          <ThemeProvider theme={theme}>
            <Container>
              <App />
            </Container>
          </ThemeProvider>
        </NotificationProvider>
      </UserProvider>
    </QueryClientProvider>
  </Router>
);
