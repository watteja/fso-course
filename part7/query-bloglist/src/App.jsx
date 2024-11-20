import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUserValue, useUserDispatch } from "./UserContext";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";

const App = () => {
  const user = useUserValue();
  const userDispatch = useUserDispatch();
  const blogFormRef = useRef();
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBloglistUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      userDispatch({ type: "SET_USER", payload: user });
    }
  }, [userDispatch]);

  // fetch blogs
  const result = useQuery({
    queryKey: ["blogs"],
    queryFn: blogService.getAll,
    retry: 1,
  });
  const blogs = result?.data || [];

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
      <h2>blogs</h2>
      <Notification />
      <p>
        {user.name} logged in<button onClick={handleLogout}>logout</button>
      </p>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm formRef={blogFormRef} />
      </Togglable>

      {result.isPending && <div>loading data...</div>}

      {result.isError && (
        <div>blog service not available due to problems in server</div>
      )}

      {blogs &&
        blogs
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => <Blog key={blog.id} blog={blog} />)}
    </div>
  );
};

export default App;
