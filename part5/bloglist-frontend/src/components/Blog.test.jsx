import { render, screen } from "@testing-library/react";
import Blog from "./Blog";
import { expect } from "vitest";

test("at start renders only blog title and author", () => {
  const blog = {
    title: "Test blog for testing with react-testing-library",
    author: "Jane Doe",
    url: "https://example.com/test-blog",
    likes: 2,
  };

  render(<Blog blog={blog} />);

  expect(screen.queryByText(blog.title)).toBeDefined();
  expect(screen.queryByText(blog.author)).toBeDefined();
  expect(screen.queryByText(blog.url)).toBeNull();
  expect(screen.queryByText(`likes ${blog.likes}`)).toBeNull();
});
