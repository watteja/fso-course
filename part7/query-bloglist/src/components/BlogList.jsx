import { useRef } from "react";
import { Link } from "react-router-dom";
import BlogForm from "./BlogForm";
import Togglable from "./Togglable";

const BlogList = ({ result }) => {
  const blogFormRef = useRef();
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
          .map((blog) => (
            <div key={blog.id} className="blog">
              <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
            </div>
          ))}
    </>
  );
};

export default BlogList;
