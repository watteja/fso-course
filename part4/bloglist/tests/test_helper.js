const Blog = require("../models/blog");
const User = require("../models/user");

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

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

const loginUser = async (api, username, password) => {
  const response = await api
    .post("/api/login")
    .send({ username, password })
    .expect(200)
    .expect("Content-Type", /application\/json/);

  return response.body.token;
};

const getUserId = async (username) => {
  const user = await User.findOne({ username });
  return user._id;
};

module.exports = {
  initialBlogs,
  blogsInDb,
  usersInDb,
  loginUser,
  getUserId,
};
