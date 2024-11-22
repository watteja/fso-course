import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useUserValue, useUserDispatch } from "./UserContext";
import blogService from "./services/blogs";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import BlogList from "./components/BlogList";
import Users from "./components/Users";

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
        <Route path="/users" element={<Users />} />
      </Routes>
    </div>
  );
};

export default App;
