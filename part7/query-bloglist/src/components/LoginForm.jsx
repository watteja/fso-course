import { useState } from "react";
import { TextField, Button } from "@mui/material";
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
      <h2>Log in to application</h2>
      <Notification />
      <form onSubmit={handleLogin}>
        <div>
          <TextField
            label="username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          <TextField
            label="password"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <Button variant="contained" color="primary" type="submit">
          login
        </Button>
      </form>
    </>
  );
};

export default LoginForm;
