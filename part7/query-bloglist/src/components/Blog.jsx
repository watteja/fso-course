import { useState } from "react";
import blogService from "../services/blogs";

const Blog = ({ blog, user, onUpdate, onDelete }) => {
  const [visible, setVisible] = useState(false);

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
    <div className="blog">
      <div>
        {blog.title + " " + blog.author}{" "}
        <button onClick={() => setVisible(!visible)}>
          {visible ? "hide" : "view"}
        </button>
      </div>
      {visible && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}{" "}
            <button onClick={() => onUpdate(blog)}>like</button>
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
