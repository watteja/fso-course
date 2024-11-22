import { useEffect } from "react";
import { Route, Routes, useMatch } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useUserValue, useUserDispatch } from "./UserContext";
import blogService from "./services/blogs";
import userService from "./services/users";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import BlogList from "./components/BlogList";
import Users from "./components/Users";
import User from "./components/User";

const App = () => {
  const user = useUserValue();
  const userDispatch = useUserDispatch();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBloglistUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      userDispatch({ type: "SET_USER", payload: user });
    }
  }, [userDispatch]);

  const usersResult = useQuery({
    queryKey: ["users"],
    queryFn: userService.getAll,
    retry: 1,
  });

  const users = usersResult?.data;
  const userById = (id) => users?.find((user) => user.id === id);
  const match = useMatch("/users/:id");
  const displayUser = match ? userById(match.params.id) : null;

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBloglistUser");
    userDispatch({ type: "CLEAR_USER" });
    blogService.setToken(null); // just in case
  };

  if (user === null) {
    return <LoginForm />;
  }

  return (
    <div>
      <h2>blog app</h2>
      <Notification />
      <p>
        {user.name} logged in<button onClick={handleLogout}>logout</button>
      </p>
      <Routes>
        <Route path="/" element={<BlogList />} />
        <Route path="/users" element={<Users result={usersResult} />} />
        <Route path="/users/:id" element={<User user={displayUser} />} />
      </Routes>
    </div>
  );
};

export default App;
