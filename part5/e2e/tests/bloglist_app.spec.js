const { test, expect, describe, beforeEach } = require("@playwright/test");

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
      await page.getByTestId("username").fill("matt");
      await page.getByTestId("password").fill("secretpass");
      await page.getByRole("button", { name: "login" }).click();
      await expect(page.getByText("Matt Tester logged in")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await page.getByTestId("username").fill("matt");
      await page.getByTestId("password").fill("wrong");
      await page.getByRole("button", { name: "login" }).click();

      const errorDiv = await page.locator(".error");
      await expect(errorDiv).toContainText("wrong username or password");
      await expect(errorDiv).toHaveCSS("border-style", "solid");
      await expect(errorDiv).toHaveCSS("color", "rgb(255, 0, 0)");

      await expect(page.getByText("Matt Tester logged in")).not.toBeVisible();
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await page.getByTestId("username").fill("matt");
      await page.getByTestId("password").fill("secretpass");
      await page.getByRole("button", { name: "login" }).click();
    });

    test("a new blog can be created", async ({ page }) => {
      await page.getByText("create new blog").click();
      await page.getByTestId("title").fill("A new test blog");
      await page.getByTestId("author").fill("John Doe");
      await page.getByTestId("url").fill("http://example.com/test-blog");
      await page.getByRole("button", { name: "create" }).click();

      await expect(page.getByText("A new test blog John Doe")).toBeVisible();
    });
  });
});
