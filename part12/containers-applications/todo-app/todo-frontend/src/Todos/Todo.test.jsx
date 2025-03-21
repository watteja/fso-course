import { render } from "@testing-library/react";
import Todo from "./Todo";
import { test, expect } from "vitest";

test("renders todo text", () => {
  const todo = { _id: "12345", text: "Vitest test", done: false };

  const { container } = render(
    <Todo todo={todo} deleteTodo={() => {}} completeTodo={() => {}} />
  );

  const div = container.querySelector(".todo");
  expect(div).toHaveTextContent(todo.text);
});
