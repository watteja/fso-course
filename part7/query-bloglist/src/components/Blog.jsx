import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import blogService from "../services/blogs";

const Blog = ({ blog, user }) => {
  const [visible, setVisible] = useState(false);
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: blogService.update,
    onSuccess: (returnedBlog) => {
      // persist user info
      returnedBlog.user = blog.user;

      queryClient.setQueryData(["blogs"], (oldData) =>
        oldData.map((b) => (b.id === returnedBlog.id ? returnedBlog : b))
      );
    },
  });
  const handleUpdate = () => {
    const updatedBlog = { ...blog, likes: blog.likes + 1, user: blog.user.id };
    updateMutation.mutate(updatedBlog);
  };

  const deleteMutation = useMutation({
    mutationFn: blogService.deleteBlog,
    onSuccess: () => {
      queryClient.setQueryData(["blogs"], (oldData) =>
        oldData.filter((b) => b.id !== blog.id)
      );
    },
  });
  const handleDelete = () => {
    // seems safer to check id instead of username
    if (user.id !== blog.user.id) {
      return;
    }

    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      deleteMutation.mutate(blog.id);
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
            likes {blog.likes} <button onClick={handleUpdate}>like</button>
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
