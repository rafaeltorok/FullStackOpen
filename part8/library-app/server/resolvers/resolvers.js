import { GraphQLError } from "graphql";
import Author from '../models/author.js';
import Book from '../models/book.js';


export const resolvers = {
  Query: {
    authorCount: async () => Author.collection.countDocuments(),
    bookCount: () => Book.collection.countDocuments(),
    allAuthors: async (root, args) => {
      return Author.find({})
    },
    allBooks: async (root, args) => {
      if (args.author) {
        return Book.find({ author: args.author })
      }
      if (args.genre) {
        return Book.find({ genres: { $in: [args.genre] } })
      }

      return Book.find({});
    },
  },
  Author: {
    bookCount: async (root, args) => {
      return Book.countDocuments({ author: root.name });
    },
  },
  Mutation: {
    addAuthor: async (root, args) => {
      const authorExists = await Author.exists({ name: args.name });

      if (authorExists) {
        throw new GraphQLError(`Author name must be unique: ${args.name}`, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
          },
        });
      }
      const author = new Author({ ...args });
      return author.save();
    },
    addBook: async (root, args) => {
      const bookExists = await Book.exists({ title: args.title });

      if (bookExists) {
        throw new GraphQLError(`Book title must be unique: ${args.title}`, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
          },
        });
      }

      const authorExists = await Author.exists({ name: args.name });

      if (!authorExists) {
        const author = new Author({ name: args.author, born: null });
        author.save();
      }

      const book = new Book({ ...args });
      return book.save();
    },
    editAuthor: async (root, args) => {
      return Author.findOneAndUpdate(
        { name: args.name },
        { born: args.setBornTo },
        { new: true }
      );
    },
  },
};
