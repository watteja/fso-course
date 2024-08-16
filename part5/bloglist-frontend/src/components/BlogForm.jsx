import { useState } from "react";
import blogService from "../services/blogs";

const BlogForm = ({ onAddBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const handleAddBlog = (event) => {
    event.preventDefault();

    const blogObject = { title, author, url };
    blogService.create(blogObject).then((returnedBlog) => {
      onAddBlog(returnedBlog);
      setTitle("");
      setAuthor("");
      setUrl("");
    });
  };

  return (
    <form onSubmit={handleAddBlog}>
      <div>
        title:
        <input
          type="text"
          value={title}
          name="Title"
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        author:
        <input
          type="text"
          value={author}
          name="Author"
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        url:
        <input
          type="text"
          value={url}
          name="Url"
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button type="submit">create</button>
    </form>
  );
};

export default BlogForm;
