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
import Blog from "./components/Blog";

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

  // fetch blogs
  const blogsResult = useQuery({
    queryKey: ["blogs"],
    queryFn: blogService.getAll,
    retry: 1,
  });

  const blogs = blogsResult?.data;
  const blogById = (id) => blogs?.find((blog) => blog.id === id);
  const blogMatch = useMatch("/blogs/:id");
  const displayBlog = blogMatch ? blogById(blogMatch.params.id) : null;

  // fetch users
  const usersResult = useQuery({
    queryKey: ["users"],
    queryFn: userService.getAll,
    retry: 1,
  });

  const users = usersResult?.data;
  const userById = (id) => users?.find((user) => user.id === id);
  const userMatch = useMatch("/users/:id");
  const displayUser = userMatch ? userById(userMatch.params.id) : null;

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
        <Route path="/" element={<BlogList result={blogsResult} />} />
        <Route path="/users" element={<Users result={usersResult} />} />
        <Route path="/users/:id" element={<User user={displayUser} />} />
        <Route path="/blogs/:id" element={<Blog blog={displayBlog} />} />
      </Routes>
    </div>
  );
};

export default App;
