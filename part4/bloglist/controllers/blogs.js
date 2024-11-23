const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const middleware = require("../utils/middleware");

blogsRouter.get("/", async (_request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
    id: 1,
  });
  response.json(blogs);
});

blogsRouter.post("/", middleware.userExtractor, async (request, response) => {
  // get user from request object
  const user = request.user;

  const body = request.body;
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  });

  // early exit if title or url are missing
  if (!body.title || !body.url) {
    return response.status(400).end();
  }

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  response.status(201).json(savedBlog);
});

blogsRouter.delete(
  "/:id",
  middleware.userExtractor, // only authorize for deleting and creating blogs
  async (request, response) => {
    // get user from request object
    const user = request.user;

    const blogToDelete = await Blog.findById(request.params.id);
    if (!blogToDelete) {
      return response.status(404).json({ error: "blog not found" });
    }

    // blogToDelete.user is not an actual object, just ObjectId
    if (blogToDelete.user.toString() !== user._id.toString()) {
      return response.status(401).json({ error: "invalid user" });
    }

    await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
  }
);

blogsRouter.put("/:id", async (request, response) => {
  const changedBlog = { ...request.body, likes: request.body.likes };
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    changedBlog,
    { new: true }
  );
  response.json(updatedBlog);
});

blogsRouter.post("/:id/comments", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  const comment = request.body.comment;
  blog.comments = [...blog.comments, comment];
  const commentedBlog = await blog.save();
  response.status(201).json(commentedBlog);
});

module.exports = blogsRouter;
