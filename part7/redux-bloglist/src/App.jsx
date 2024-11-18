import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Blog from "./components/Blog";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import { setUser, clearUser } from "./reducers/userReducer";
import { initializeBlogs, createBlog } from "./reducers/blogReducer";
import { showNotification } from "./reducers/notificationReducer";

const App = () => {
  const dispatch = useDispatch();
  const blogFormRef = useRef();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBloglistUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setUser(user));
    }
  }, [dispatch]);
  const user = useSelector((state) => state.user);

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

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBloglistUser");
    dispatch(clearUser());
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
        <BlogForm onAddBlog={addBlog} />
      </Togglable>

      {[...blogs] // copy the array to avoid mutating the original because RTK will shout at you
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
    </div>
  );
};

export default App;
