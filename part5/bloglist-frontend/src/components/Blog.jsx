import { useState } from "react";
import blogService from "../services/blogs";

const Blog = ({ blog, user, onUpdate, onDelete }) => {
  const [visible, setVisible] = useState(false);
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const handleLike = () => {
    const changedBlog = { ...blog, likes: blog.likes + 1, user: blog.user.id };
    blogService
      .update(changedBlog)
      .then((returnedBlog) => onUpdate(returnedBlog));
  };

  const handleDelete = () => {
    // seems safer to check id instead of username
    if (user.id !== blog.user.id) {
      return;
    }

    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      blogService.deleteBlog(blog.id).then(() => onDelete(blog.id));
    }
  };

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}{" "}
        <button onClick={() => setVisible(!visible)}>
          {visible ? "hide" : "view"}
        </button>
      </div>
      {visible && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes} <button onClick={handleLike}>like</button>
          </div>
          <div>{blog.user.name}</div>
          {user.id === blog.user.id && (
            <button onClick={handleDelete}>remove</button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
