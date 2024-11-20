import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";

const App = () => {
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBloglistUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
    }
  }, []);

  // fetch blogs
  const result = useQuery({
    queryKey: ["blogs"],
    queryFn: blogService.getAll,
    retry: 1,
  });
  const blogs = result?.data || [];

  const [user, setUser] = useState(null);

  const blogFormRef = useRef();

  const updateBlog = (blogToChange) => {
    // const changedBlog = {
    //   ...blogToChange,
    //   likes: blogToChange.likes + 1,
    //   user: blogToChange.user.id,
    // };
    // // calling API outside the component, for easier unit testing
    // blogService.update(changedBlog).then((returnedBlog) => {
    //   // persist user info
    //   returnedBlog.user = JSON.parse(JSON.stringify(blogToChange.user));
    //   setBlogs(
    //     blogs.map((blog) => (blog.id === returnedBlog.id ? returnedBlog : blog))
    //   );
    // });
    console.log("This will be implemented in exercise 7.12");
  };

  const deleteBlog = (id) => {
    // setBlogs(blogs.filter((blog) => blog.id !== id));
    console.log("This will be implemented in exercise 7.12");
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
        <BlogForm user={user} formRef={blogFormRef} />
      </Togglable>

      {result.isPending && <div>loading data...</div>}

      {result.isError && (
        <div>blog service not available due to problems in server</div>
      )}

      {blogs &&
        blogs
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
