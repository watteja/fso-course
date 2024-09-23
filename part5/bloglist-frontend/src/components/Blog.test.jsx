import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";
import { expect, test } from "vitest";

test("at start renders only blog title and author", () => {
  const blog = {
    title: "Test blog for testing with react-testing-library",
    author: "John Tester",
    url: "https://example.com/test-blog",
    likes: 2,
  };

  render(<Blog blog={blog} />);

  expect(screen.queryByText(blog.title)).toBeDefined();
  expect(screen.queryByText(blog.author)).toBeDefined();
  expect(screen.queryByText(blog.url)).toBeNull();
  expect(screen.queryByText(`likes ${blog.likes}`)).toBeNull();
});

test("url and likes are displayed when view button is clicked", async () => {
  const userInfo = {
    id: "test-id",
    name: "Test User",
  };

  const blog = {
    title: "Test blog for testing with react-testing-library",
    author: "John Tester",
    url: "https://example.com/test-blog",
    likes: 2,
    user: userInfo,
  };

  render(<Blog blog={blog} user={userInfo} />);
  const button = screen.getByText("view");
  await userEvent.click(button);

  expect(screen.queryByText(blog.url)).toBeDefined();
  expect(screen.queryByText(`likes ${blog.likes}`)).toBeDefined();
});

test("clicking the like button twice calls event handler twice", async () => {
  const userInfo = {
    id: "test-id",
    name: "Test User",
  };

  const blog = {
    title: "Test blog for testing with react-testing-library",
    author: "John Tester",
    url: "https://example.com/test-blog",
    likes: 2,
    user: userInfo,
  };

  const mockUpdateHandler = vi.fn();
  render(<Blog blog={blog} user={userInfo} onUpdate={mockUpdateHandler} />);

  // start user session
  const user = userEvent.setup();
  const viewBtn = screen.getByText("view");
  await user.click(viewBtn);
  const likeBtn = screen.getByText("like");
  await user.click(likeBtn);
  await user.click(likeBtn);

  expect(mockUpdateHandler.mock.calls).toHaveLength(2);
});
