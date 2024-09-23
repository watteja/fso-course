import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);

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
      setMessage({
        text: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
        type: "success",
      });
      setTimeout(() => {
        setMessage(null);
      }, 5000);
      setBlogs(blogs.concat(returnedBlog));
    });
  };

  const updateBlog = (changedBlog) => {
    // calling API outside the component, for easier unit testing
    blogService.update(changedBlog).then((returnedBlog) => {
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
      <Notification message={message} />
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
