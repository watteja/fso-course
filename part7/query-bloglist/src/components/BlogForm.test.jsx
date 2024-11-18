import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";
import { test, expect, vi } from "vitest";

test("<BlogForm /> calls passed handler with correct details", async () => {
  const mockAddBlog = vi.fn();
  render(<BlogForm onAddBlog={mockAddBlog} />);

  // to avoid adding placeholder just for tests, I used labels instead
  const titleInput = screen.getByLabelText("title:");
  const authorInput = screen.getByLabelText("author:");
  const urlInput = screen.getByLabelText("url:");

  // start user session
  const user = userEvent.setup();
  await user.type(titleInput, "Test blog for testing");
  await user.type(authorInput, "John Tester");
  await user.type(urlInput, "https://example.com/test-blog");

  const createBtn = screen.getByText("create");
  await user.click(createBtn);

  expect(mockAddBlog.mock.calls).toHaveLength(1);
  expect(mockAddBlog.mock.calls[0][0].title).toBe("Test blog for testing");
  expect(mockAddBlog.mock.calls[0][0].author).toBe("John Tester");
  expect(mockAddBlog.mock.calls[0][0].url).toBe(
    "https://example.com/test-blog"
  );
});
