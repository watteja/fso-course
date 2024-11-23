import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserValue } from "../UserContext";
import blogService from "../services/blogs";

const Blog = ({ blog }) => {
  const [comment, setComment] = useState("");
  const queryClient = useQueryClient();
  const user = useUserValue();

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

  const addCommentMutation = useMutation({
    mutationFn: blogService.addComment,
    onSuccess: (returnedBlog) => {
      // persist user info
      returnedBlog.user = blog.user;

      queryClient.setQueryData(["blogs"], (oldData) =>
        oldData.map((b) => (b.id === returnedBlog.id ? returnedBlog : b))
      );
    },
  });
  const handleAddComment = (event) => {
    event.preventDefault();
    addCommentMutation.mutate({ id: blog.id, comment });
  };

  if (!blog) {
    return null;
  }

  return (
    <>
      <h2>
        {blog.title} {blog.author}
      </h2>
      <div>
        <a href={blog.url}>{blog.url}</a>
        <div>
          {blog.likes} likes <button onClick={handleUpdate}>like</button>
        </div>
        <div>added by {blog.user.name}</div>
        {user.id === blog.user.id && (
          <button onClick={handleDelete}>remove</button>
        )}
      </div>

      {blog.comments.length > 0 && (
        <div>
          <h3>comments</h3>
          <form onSubmit={handleAddComment}>
            <input
              type="text"
              value={comment}
              name="Comment"
              onChange={({ target }) => setComment(target.value)}
            />
            <button type="submit">add comment</button>
          </form>
          <ul>
            {blog.comments.map((comment, index) => (
              // Using comment-index combination is not ideal, but
              // still better than using index alone. The React' internal
              // optimization is hampered only when identical comments are
              // added, which should happen rarely.
              // If model becomes more complex, use a unique id for comments.
              <li key={`${comment}-${index}`}>{comment}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default Blog;
