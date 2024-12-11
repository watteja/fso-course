import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import mongoose from "mongoose";
mongoose.set("strictQuery", false);
import Author from "./models/Author.js";
import Book from "./models/Book.js";
import "dotenv/config.js";

const MONGODB_URI = process.env.MONGODB_URI;

console.log("connecting to", MONGODB_URI);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const typeDefs = `
  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
      ): Book

      editAuthor(
        name: String!
        setBornTo: Int!
      ): Author
  }
`;

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (_root, args) => {
      const query = {};

      if (args.author) {
        // get author ID from the database
        const author = await Author.findOne({ name: args.author });
        query.author = author._id;
      }

      if (args.genre) {
        query.genres = { $in: [args.genre] };
      }

      return Book.find(query).populate("author");
    },
    allAuthors: async () => Author.find({}),
  },

  Mutation: {
    addBook: async (_root, args) => {
      let author = await Author.findOne({ name: args.author });

      // Create author if they are not already in the list
      if (!author) {
        author = new Author({ name: args.author });
        await author.save();
      }

      const book = new Book({ ...args, author: author._id });
      await book.save();
      return book;
    },

    editAuthor: async (_root, args) => {
      const author = await Author.findOne({ name: args.name });
      if (!author) {
        return null;
      }

      author.born = args.setBornTo;
      await author.save();
      return author;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
