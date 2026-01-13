import { authors, books } from "../data.js";
import { v1 as uuid } from "uuid";
import { GraphQLError } from "graphql";

export const resolvers = {
  Query: {
    authorCount: () => authors.length,
    bookCount: () => books.length,
    allAuthors: () => authors,
    allBooks: (root, args) => {
      let filteredBooks = books;

      if (args.author) {
        filteredBooks = filteredBooks.filter((b) => b.author === args.author);
      }
      if (args.genre) {
        filteredBooks = filteredBooks.filter((b) =>
          b.genres.includes(args.genre),
        );
      }

      return filteredBooks;
    },
  },
  Author: {
    bookCount: (root) => {
      return books.filter((book) => book.author === root.name).length;
    },
  },
  Mutation: {
    addAuthor: (root, args) => {
      if (authors.find((a) => a.name === args.name)) {
        throw new GraphQLError(`Author name must be unique: ${args.name}`, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
          },
        });
      }
      const author = { ...args, id: uuid() };
      authors.push(author);
      return author;
    },
    addBook: (root, args) => {
      if (books.find((b) => b.title === args.title)) {
        throw new GraphQLError(`Book title must be unique: ${args.title}`, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
          },
        });
      }

      if (!authors.find((a) => a.name === args.author)) {
        authors.push({ name: args.author, born: null, id: uuid() });
      }

      const book = { ...args, id: uuid() };
      books.push(book);
      return book;
    },
    editAuthor: (root, args) => {
      const index = authors.findIndex((a) => a.name === args.name);
      if (index === -1) {
        return null;
      }
      authors[index].born = args.setBornTo;
      return authors[index];
    },
  },
};