const { test, describe, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const bcrypt = require("bcrypt");

const helper = require("./test_helper");

const User = require("../models/user");
const Blog = require("../models/blog");

describe.only("when there are some initial notes saved", async () => {
  beforeEach(async () => {
    // clear the data from the test version of database
    await Blog.deleteMany({});
    await User.deleteMany({});

    // create new user to generate token for
    const passwordHash = await bcrypt.hash("rootUserPassword123", 10);
    const user = new User({ username: "root", passwordHash });
    await user.save();

    // assign the created user to every initial blog
    const userId = await helper.getUserId("root");
    const blogsWithUser = helper.initialBlogs.map((blog) => ({
      ...blog,
      user: userId,
    }));

    // insert initial data
    await Blog.insertMany(blogsWithUser);
  });

  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");
    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });

  test("the unique identifier property of the blog posts is named id", async () => {
    const blogs = await helper.blogsInDb();
    assert(blogs[0].id);
  });

  describe("addition of a new blogpost", async () => {
    test("succeeds with valid data", async () => {
      // log in the created user
      const token = await helper.loginUser(api, "root", "rootUserPassword123");

      const newBlog = {
        title: "Blogpost for testing the POST method",
        author: "Jane Doe",
        url: "https://www.example.com/testing-post-method",
        likes: 2,
        user: await helper.getUserId("root"),
      };

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

      const blogPostTitles = blogsAtEnd.map((blog) => blog.title);
      assert(blogPostTitles.includes("Blogpost for testing the POST method"));
    });

    test("if the likes property is missing from the request, it will default to 0", async () => {
      const token = await helper.loginUser(api, "root", "rootUserPassword123");
      const blogWithMissingLikes = {
        title: "Blogpost without any registered likes",
        author: "Urkel the Unpopular",
        url: "https://www.example.com/nobody-likes-me",
        user: await helper.getUserId("root"),
      };

      const response = await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(blogWithMissingLikes);
      assert.strictEqual(response.body.likes, 0);
    });

    test("if the blogpost is missing title or url, respond with 400 Bad Request", async () => {
      const token = await helper.loginUser(api, "root", "rootUserPassword123");
      const blogWithMissingTitle = {
        author: "Frank Forgetful",
        url: "example.com/not-even-a-title",
        user: await helper.getUserId("root"),
      };
      const blogWithMissingUrl = {
        title: "Blogpost with missing URL",
        author: "Frank Forgetful",
        user: await helper.getUserId("root"),
      };

      let response = await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(blogWithMissingTitle);
      assert.strictEqual(response.status, 400);
      response = await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(blogWithMissingUrl);
      assert.strictEqual(response.status, 400);
    });
  });

  test.only("deletion of a blogpost", async () => {
    const token = await helper.loginUser(api, "root", "rootUserPassword123");
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);
    const remainingBlogTitles = blogsAtEnd.map((blog) => blog.title);
    assert(!remainingBlogTitles.includes(blogToDelete.title));
  });

  test("changing likes of a blogpost", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];
    const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 10 };

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog); // just like for POST, we send JSON data
    assert.strictEqual(response.body.likes, blogToUpdate.likes + 10);
  });
});

describe("when there is initially one user at db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("rootUserPassword123", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "secret_in_finnish",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    assert(usernames.includes(newUser.username));
  });

  test("creation fails with proper statuscode and message if username already taken", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "secret_in_finnish",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();

    assert(result.body.error.includes("expected `username` to be unique"));

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("creation fails with proper statuscode and message if username is too short", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "me",
      name: "Myself And I",
      password: "secret_in_finnish",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();

    assert(
      result.body.error.includes(
        "Path `username` (`me`) is shorter than the minimum allowed length (3)"
      )
    );

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("creation fails with proper statuscode and message if password is too short", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "John_Doe",
      name: "John Doe",
      password: "hi",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();

    assert(
      result.body.error.includes("Password must be at least 3 characters long")
    );

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });
});

// Test runner doesn't work reliably if we register after hook outside of
// the describe block. Move it back inside if it makes the testing hang.
after(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});
