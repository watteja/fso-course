import { useState } from "react";

const BlogForm = ({ onAddBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const handleAddBlog = (event) => {
    event.preventDefault();

    const blogObject = { title, author, url };
    onAddBlog(blogObject);
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
