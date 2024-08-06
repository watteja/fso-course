const { test, describe, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const Blog = require("../models/blog");

const initialBlogs = [
  {
    title: "This is a random title",
    author: "John Doe",
    url: "https://www.example.com/clever-blogpost",
    likes: 18,
  },
  {
    title: "5 ways to make your code more readable",
    author: "Lizzy McBlogsalot",
    url: "example.com/reader-friendly-0245882",
    likes: 22,
  },
];

describe("when there are some initial notes saved", async () => {
  beforeEach(async () => {
    // clear the data from the test version of database
    await Blog.deleteMany({});

    // insert initial data
    await Blog.insertMany(initialBlogs);
  });

  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");
    assert.strictEqual(response.body.length, initialBlogs.length);
  });

  test("the unique identifier property of the blog posts is named id", async () => {
    const response = await api.get("/api/blogs");
    assert(response.body[0].id);
  });

  describe("addition of a new blogpost", async () => {
    test("succeeds with valid data", async () => {
      const newBlog = {
        title: "Blogpost for testing the POST method",
        author: "Jane Doe",
        url: "https://www.example.com/testing-post-method",
      };

      await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const response = await api.get("/api/blogs");
      assert.strictEqual(response.body.length, initialBlogs.length + 1);

      const blogPostTitles = response.body.map((blog) => blog.title);
      assert(blogPostTitles.includes("Blogpost for testing the POST method"));
    });

    test("if the likes property is missing from the request, it will default to 0", async () => {
      const blogWithMissingLikes = {
        title: "Blogpost without any registered likes",
        author: "Urkel the Unpopular",
        url: "https://www.example.com/nobody-likes-me",
      };

      const response = await api.post("/api/blogs").send(blogWithMissingLikes);
      assert.strictEqual(response.body.likes, 0);
    });

    test("if the blogpost is missing title or url, respond with 400 Bad Request", async () => {
      const blogWithMissingTitle = {
        author: "Frank Forgetful",
        url: "example.com/not-even-a-title",
      };
      const blogWithMissingUrl = {
        title: "Blogpost with missing URL",
        author: "Frank Forgetful",
      };

      let response = await api.post("/api/blogs").send(blogWithMissingTitle);
      assert.strictEqual(response.status, 400);
      response = await api.post("/api/blogs").send(blogWithMissingUrl);
      assert.strictEqual(response.status, 400);
    });
  });

  test("deletion of a blogpost", async () => {
    const initialResponse = await api.get("/api/blogs");
    const blogToDelete = initialResponse.body[0];
    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const remainingBlogsResponse = await api.get("/api/blogs");
    const remainingBlogs = remainingBlogsResponse.body.map(
      (blog) => blog.title
    );
    assert.strictEqual(remainingBlogs.length, initialResponse.body.length - 1);
    assert(!remainingBlogs.includes(blogToDelete.title));
  });

  test("changing likes of a blogpost", async () => {
    const initialResponse = await api.get("/api/blogs");
    const blogToUpdate = initialResponse.body[0];
    const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 10 };

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog); // just like for POST, we send JSON data
    assert.strictEqual(response.body.likes, blogToUpdate.likes + 10);
  });

  // Test runner doesn't work reliably if we register after hook outside of the describe block
  after(async () => {
    await mongoose.connection.close();
  });
});
