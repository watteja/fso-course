const loginWith = async (page, username, password) => {
  await page.getByTestId("username").fill(username);
  await page.getByTestId("password").fill(password);
  await page.getByRole("button", { name: "login" }).click();
};

const createBlog = async (page, blog) => {
  await page.getByText("create new blog").click();
  await page.getByTestId("title").fill(blog.title);
  await page.getByTestId("author").fill(blog.author);
  await page.getByTestId("url").fill(blog.url);
  await page.getByRole("button", { name: "create" }).click();
  await page.getByText(`${blog.title} ${blog.author}`).waitFor();

  // click view inside the added blog
  let newBlog = await page.locator(".blog").last();
  await newBlog.getByRole("button", { name: "view" }).click();

  if (blog.likes) {
    // click the specified number of likes
    for (let i = 0; i < blog.likes; i++) {
      // like the target blog
      await page
        .getByText(`${blog.title} ${blog.author}`)
        .locator("..")
        .getByText("like")
        .click();

      // make sure the count is right before proceeding
      await page
        .getByText(`${blog.title} ${blog.author}`)
        .locator("..")
        .getByText(`likes ${i + 1}`)
        .waitFor();
    }
  }
};

export { loginWith, createBlog };
