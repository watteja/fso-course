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
        password: "mysecretpassword",
      },
    });

    await page.goto("http://localhost:5173");
  });

  test("Login form is shown", async ({ page }) => {
    const locator = await page.getByText("Log in to application");
    await expect(locator).toBeVisible();
  });

  describe("Login", () => {
    test("fails with wrong credentials", async ({ page }) => {
      await page.getByTestId("username").fill("wrong_username");
      await page.getByTestId("password").fill("mysecretpassword");
      await page.getByRole("button", { name: "login" }).click();
      await expect(page.getByText("wrong username or password")).toBeVisible();
    });

    test("succeeds with correct credentials", async ({ page }) => {
      await page.getByTestId("username").fill("matt");
      await page.getByTestId("password").fill("mysecretpassword");
      await page.getByRole("button", { name: "login" }).click();
      await expect(page.getByText("Matt Tester logged in")).toBeVisible();
    });
  });
});
