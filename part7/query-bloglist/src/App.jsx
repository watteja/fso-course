import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Notification from "./components/Notification";
import { useNotify } from "./NotificationContext";
import Togglable from "./components/Togglable";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const notifyWith = useNotify();

  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBloglistUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
    }
  }, []);

  const addBlog = (newBlog) => {
    // calling API outside the component, for easier unit testing
    blogService.create(newBlog).then((returnedBlog) => {
      blogFormRef.current.toggleVisibility();
      const notification = {
        type: "success",
        text: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
      };
      notifyWith(notification);

      // MongoDB's insert method returns just the user id, not the whole object
      returnedBlog.user = user;
      setBlogs(blogs.concat(returnedBlog));
    });
  };

  const updateBlog = (blogToChange) => {
    const changedBlog = {
      ...blogToChange,
      likes: blogToChange.likes + 1,
      user: blogToChange.user.id,
    };
    // calling API outside the component, for easier unit testing
    blogService.update(changedBlog).then((returnedBlog) => {
      // persist user info
      returnedBlog.user = JSON.parse(JSON.stringify(blogToChange.user));
      setBlogs(
        blogs.map((blog) => (blog.id === returnedBlog.id ? returnedBlog : blog))
      );
    });
  };

  const deleteBlog = (id) => {
    setBlogs(blogs.filter((blog) => blog.id !== id));
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

      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            user={user}
            onUpdate={updateBlog}
            onDelete={deleteBlog}
          />
        ))}
    </div>
  );
};

export default App;
