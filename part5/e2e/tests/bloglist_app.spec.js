import { test, expect, describe, beforeEach } from "@playwright/test";
import { loginWith, createBlog } from "./helper";

const testBlogContents = {
  title: "A new test blog",
  author: "John Doe",
  url: "http://example.com/test-blog",
};

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    // reset database
    await request.post("/api/testing/reset");
    // add a single user
    await request.post("/api/users", {
      data: {
        name: "Matt Tester",
        username: "matt",
        password: "secretpass",
      },
    });

    await page.goto("/");
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
      await createBlog(page, testBlogContents);
      await expect(page.getByText("A new test blog John Doe")).toBeVisible();
    });

    describe("and a blog exists", () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, testBlogContents);
      });

      test("it can be liked", async ({ page }) => {
        await page.getByText("like").click();
        await expect(page.getByText("likes 1")).toBeVisible();
      });

      test("it can be deleted", async ({ page }) => {
        // accept the confirmation dialog when it appears
        page.on("dialog", (dialog) => dialog.accept());
        await page.getByText("remove").click();

        await expect(
          page.getByText("A new test blog John Doe")
        ).not.toBeVisible();
      });

      test("it can't be deleted by someone else", async ({ page, request }) => {
        // log out the first current user
        await page.getByText("logout").click();

        // add a different user
        await request.post("/api/users", {
          data: {
            name: "Jane Tester",
            username: "jane",
            password: "bestpass",
          },
        });

        await loginWith(page, "jane", "bestpass");
        await page.getByText("view").click();

        await expect(page.getByText("remove")).not.toBeVisible();
      });
    });

    describe("and several blogs exist", () => {
      // populate the database with some blogs
      beforeEach(async ({ page }) => {
        const blogsOfVaryingPopularity = [
          {
            title: "Blog 1",
            author: "Author 1",
            url: "http://example.com/blog1",
          },
          {
            title: "Blog 2",
            author: "Author 2",
            url: "http://example.com/blog2",
            likes: 4,
          },
          {
            title: "Blog 3",
            author: "Author 3",
            url: "http://example.com/blog3",
            likes: 1,
          },
          {
            title: "Blog 4",
            author: "Author 4",
            url: "http://example.com/blog4",
            likes: 3,
          },
        ];

        // add several blogs with likes
        for (const blog of blogsOfVaryingPopularity) {
          await createBlog(page, blog);
        }
      });

      test("they are arranged by likes, descending", async ({ page }) => {
        const likes = [];
        for (const blog of await page.locator(".blog").all()) {
          const likesDiv = await blog.getByText("likes ").textContent();
          const likesAmount = likesDiv.split(" ")[1];
          likes.push(likesAmount);
        }

        expect(likes).toEqual(["4", "3", "1", "0"]);
      });
    });
  });
});
