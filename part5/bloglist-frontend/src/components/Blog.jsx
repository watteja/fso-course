import { useState } from "react";
import blogService from "../services/blogs";

const Blog = ({ blog, onUpdate }) => {
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

  return (
    <div style={blogStyle}>
      <div>
        {blog.title}{" "}
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
          <div>{blog.author}</div>
        </div>
      )}
    </div>
  );
};

export default Blog;
