import { useState } from "react";
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
          username
          <input
            type="text"
            value={username}
            name="Username"
            data-testid="username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            data-testid="password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </>
  );
};

export default LoginForm;
