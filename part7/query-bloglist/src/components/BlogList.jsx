import { useRef } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Link } from "@mui/material";
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

      {blogs && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5, // Space between links
            p: 2, // Padding for the list container
            border: "1px solid #e0e0e0", // Subtle border
            borderRadius: 2, // Rounded corners
            boxShadow: 1, // Subtle shadow for sleek look
            backgroundColor: "secondary.light", // Light background
          }}
        >
          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <Box
                key={blog.id}
                sx={{
                  padding: 1, // Add padding for clickable area
                  borderRadius: 1, // Rounded corners for individual items
                  transition: "background-color 0.3s, color 0.3s", // Smooth transitions
                  "&:hover": {
                    backgroundColor: "primary.dark", // Light gray background
                    color: "white", // Text color changes on hover
                  },
                }}
              >
                <Link
                  component={RouterLink}
                  sx={{ display: "block", width: "100%" }}
                  to={`/blogs/${blog.id}`}
                >
                  {blog.title}
                </Link>
              </Box>
            ))}
        </Box>
      )}
    </>
  );
};

export default BlogList;
