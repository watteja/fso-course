import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import { initializeBlogs, createBlog } from "./reducers/blogReducer";
import { showNotification } from "./reducers/notificationReducer";

const App = () => {
  const [user, setUser] = useState(null);

  const blogFormRef = useRef();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBloglistUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
    }
  }, []);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(initializeBlogs());
  }, [dispatch]);
  const blogs = useSelector((state) => state.blogs);

  const addBlog = (newBlog) => {
    blogFormRef.current.toggleVisibility();

    dispatch(createBlog(newBlog, user));

    const notification = {
      text: `a new blog ${newBlog.title} by ${newBlog.author} added`,
      type: "success",
    };
    dispatch(showNotification(notification, 5));
  };

  const loginUser = (user) => {
    blogService.setToken(user.token);
    setUser(user);
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBloglistUser");
    setUser(null);
    blogService.setToken(null); // just in case
  };

  if (user === null) {
    return <LoginForm onLogin={loginUser} />;
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <p>
        {user.name} logged in<button onClick={handleLogout}>logout</button>
      </p>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm onAddBlog={addBlog} />
      </Togglable>

      {[...blogs] // copy the array to avoid mutating the original because RTK will shout at you
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog key={blog.id} blog={blog} user={user} />
        ))}
    </div>
  );
};

export default App;
