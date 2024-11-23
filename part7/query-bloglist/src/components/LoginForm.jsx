import { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import loginService from "../services/login";
import blogService from "../services/blogs";
import Notification from "./Notification";
import { useUserDispatch } from "../UserContext";
import { useNotify } from "../NotificationContext";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const userDispatch = useUserDispatch();
  const notifyWith = useNotify();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedBloglistUser", JSON.stringify(user));
      blogService.setToken(user.token);
      userDispatch({ type: "SET_USER", payload: user });
      setUsername("");
      setPassword("");
    } catch {
      const notification = {
        type: "error",
        text: "wrong username or password",
      };
      notifyWith(notification);
    }
  };

  return (
    <>
      <Typography variant="h4" sx={{ mt: 2, mb: 2 }}>
        Log in to application
      </Typography>
      <Notification />
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        onSubmit={handleLogin}
      >
        <TextField
          label="username"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
        <TextField
          label="password"
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ alignSelf: "flex-start" }}
          type="submit"
        >
          login
        </Button>
      </Box>
    </>
  );
};

export default LoginForm;
