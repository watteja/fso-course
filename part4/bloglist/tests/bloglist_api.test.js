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

  // insert initial data
  await Blog.insertMany(initialBlogs);
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

after(async () => {
  await mongoose.connection.close();
});
