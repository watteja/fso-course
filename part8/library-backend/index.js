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
    allBooks: (_root, args) => {
      let filtered = Book.find({});

      // if (args.author) {
      //   filtered = filtered.filter((book) => book.author === args.author);
      // }

      // if (args.genre) {
      //   filtered = filtered.filter((book) => book.genres.includes(args.genre));
      // }

      return filtered;
    },
    allAuthors: () =>
      Author.find({}).map((author) => {
        // const authorBooks = books.filter((book) => book.author === author.name);
        return {
          ...author,
          // bookCount: authorBooks.length,
          bookCount: 0,
        };
      }),
  },

  Mutation: {
    addBook: async (_root, args) => {
      // Create author if they are not already in the list
      // const existingAuthor = authors.find(
      //   (author) => author.name === args.author
      // );
      // if (!existingAuthor) {
      //   const newAuthor = { name: args.author, id: uuidv4() };
      //   authors = authors.concat(newAuthor);
      // }

      const book = new Book({ ...args });
      await book.save();
      return book;
    },

    editAuthor: (_root, args) => {
      // const author = authors.find((author) => author.name === args.name);
      // if (!author) {
      //   return null;
      // }

      // const updatedAuthor = { ...author, born: args.setBornTo };
      // authors = authors.map((a) => (a.name === args.name ? updatedAuthor : a));
      // return updatedAuthor;
      return null;
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
