import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import blogService from "../services/blogs";
import BlogForm from "./BlogForm";
import Blog from "./Blog";
import Togglable from "./Togglable";

const BlogList = () => {
  const blogFormRef = useRef();

  // fetch blogs
  const result = useQuery({
    queryKey: ["blogs"],
    queryFn: blogService.getAll,
    retry: 1,
  });
  const blogs = result?.data || [];
  return (
    <>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm formRef={blogFormRef} />
      </Togglable>

      {result.isPending && <div>loading data...</div>}

      {result.isError && (
        <div>blog service not available due to problems in server</div>
      )}

      {blogs &&
        blogs
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => <Blog key={blog.id} blog={blog} />)}
    </>
  );
};

export default BlogList;
