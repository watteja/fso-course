import { test, expect, describe, beforeEach } from "@playwright/test";
import { loginWith, createBlog } from "./helper";

const blogContents = {
  title: "A new test blog",
  author: "John Doe",
  url: "http://example.com/test-blog",
};

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    // reset database
    await request.post("http://localhost:3003/api/testing/reset");
    // add a single user
    await request.post("http://localhost:3003/api/users", {
      data: {
        name: "Matt Tester",
        username: "matt",
        password: "secretpass",
      },
    });

    await page.goto("http://localhost:5173");
  });

  test("Login form is shown", async ({ page }) => {
    const locator = await page.getByText("Log in to application");
    await expect(locator).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await loginWith(page, "matt", "secretpass");
      await expect(page.getByText("Matt Tester logged in")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await loginWith(page, "matt", "wrong");

      const errorDiv = page.locator(".error");
      await expect(errorDiv).toContainText("wrong username or password");
      await expect(errorDiv).toHaveCSS("border-style", "solid");
      await expect(errorDiv).toHaveCSS("color", "rgb(255, 0, 0)");

      await expect(page.getByText("Matt Tester logged in")).not.toBeVisible();
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "matt", "secretpass");
    });

    test("a new blog can be created", async ({ page }) => {
      await createBlog(page, blogContents);
      await expect(page.getByText("A new test blog John Doe")).toBeVisible();
    });

    describe("and a blog exists", () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, blogContents);
      });

      test("it can be liked", async ({ page }) => {
        await page.getByText("view").click();
        await page.getByText("like").click();
        await expect(page.getByText("likes 1")).toBeVisible();
      });
    });
  });
});
