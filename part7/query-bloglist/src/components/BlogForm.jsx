import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserValue } from "../UserContext";
import { useNotify } from "../NotificationContext";
import blogService from "../services/blogs";

const BlogForm = ({ formRef }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const user = useUserValue();
  const notifyWith = useNotify();

  // handle adding new blog
  const queryClient = useQueryClient();
  const addBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      // MongoDB's insert method returns just the user id, not the whole object
      newBlog.user = user;
      const blogs = queryClient.getQueryData(["blogs"]);
      queryClient.setQueryData(["blogs"], [...blogs, newBlog]);
    },
    onError: (error) => {
      notifyWith({ type: "error", text: error.response.data.error });
    },
  });

  const handleAddBlog = (event) => {
    event.preventDefault();

    const blogObject = { title, author, url };
    blogService.create(blogObject).then((returnedBlog) => {
      addBlogMutation.mutate(blogObject);
      formRef.current.toggleVisibility();
      const notification = {
        type: "success",
        text: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
      };
      notifyWith(notification);
    });

    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <form onSubmit={handleAddBlog}>
      <div>
        <label htmlFor="title">title:</label>
        <input
          type="text"
          value={title}
          name="Title"
          id="title"
          data-testid="title"
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        <label htmlFor="author">author:</label>
        <input
          type="text"
          value={author}
          name="Author"
          id="author"
          data-testid="author"
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        <label htmlFor="url">url:</label>
        <input
          type="text"
          value={url}
          name="Url"
          id="url"
          data-testid="url"
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button type="submit">create</button>
    </form>
  );
};

export default BlogForm;
