import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Box, TextField, Button } from "@mui/material";
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
    <Box
      component="form"
      sx={{ display: "flex", flexDirection: "column", gap: 1 }}
      onSubmit={handleAddBlog}
    >
      <TextField
        label="title"
        value={title}
        sx={{ alignSelf: "flex-start" }}
        onChange={({ target }) => setTitle(target.value)}
      />
      <TextField
        label="author"
        value={author}
        sx={{ alignSelf: "flex-start" }}
        onChange={({ target }) => setAuthor(target.value)}
      />
      <TextField
        label="url"
        value={url}
        sx={{ alignSelf: "flex-start" }}
        onChange={({ target }) => setUrl(target.value)}
      />
      <Button
        variant="contained"
        type="submit"
        sx={{ alignSelf: "flex-start" }}
      >
        create
      </Button>
    </Box>
  );
};

export default BlogForm;
