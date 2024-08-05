const { test, after, beforeEach } = require("node:test");
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

beforeEach(async () => {
  // clear the data from the test version of database
  await Blog.deleteMany({});
  console.log("clear bloglist");

  // insert initial data
  await Blog.insertMany(initialBlogs);
  console.log("inserted initial data");
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("there are two blogs in the list", async () => {
  const response = await api.get("/api/blogs");
  assert.strictEqual(response.body.length, 2);
});

test("the unique identifier property of the blog posts is named id", async () => {
  const response = await api.get("/api/blogs");
  assert(response.body[0].id);
});

test("a valid blog can be added", async () => {
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

test("if the blog is missing title or url, respond with 400 Bad Request", async () => {
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

test.only("deletion of a blog", async () => {
  const initialResponse = await api.get("/api/blogs");
  const blogToDelete = initialResponse.body[0];
  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

  const remainingBlogsResponse = await api.get("/api/blogs");
  const remainingBlogs = remainingBlogsResponse.body.map((blog) => blog.title);
  assert.strictEqual(remainingBlogs.length, initialResponse.body.length - 1);
  assert(!remainingBlogs.includes(blogToDelete.title));
});

after(async () => {
  await mongoose.connection.close();
});
