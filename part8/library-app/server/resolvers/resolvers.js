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
      const filter = {}

      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        if (!author) {
          return []
        }
        filter.author = author._id
      }

      if (args.genre) {
        filter.genres = { $in: [args.genre] }
      }

      return Book.find(filter).populate('author')
    },
  },
  Author: {
    bookCount: async (root, args) => {
      return Book.countDocuments({ author: root._id });
    },
  },
  Mutation: {
    addAuthor: async (root, args) => {
      if (args.name.trim().length < 4) {
        throw new GraphQLError("An author's name must have at least 4 characters", {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
          }
        });
      }

      const authorExists = await Author.exists({ name: args.name });

      if (authorExists) {
        throw new GraphQLError(`Author name must be unique: ${args.name}`, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
          },
        });
      }

      const author = new Author({ name: args.name, born: args.born });

      try {
        await author.save();
      } catch (error) {
        throw new GraphQLError(`Failed to add a new author: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            error
          }
        });
      }

      return author;
    },
    addBook: async (root, args) => {
      if (args.title.trim().length < 5) {
        throw new GraphQLError("A book's title must have at least 5 characters", {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
          }
        });
      }

      const bookExists = await Book.exists({ title: args.title });

      if (bookExists) {
        throw new GraphQLError(`Book title must be unique: ${args.title}`, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.title,
          },
        });
      }

      let author = await Author.findOne({ name: args.author });

      if (!author) {
        author = new Author({ name: args.author, born: null });
        await author.save();
      }

      const book = new Book(
        { title: args.title, published: args.published, author: author._id, genres: args.genres }
      );

      try {
        await book.save();
      } catch (error) {
        throw new GraphQLError(`Failed to add a new book: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.author,
            error
          }
        });
      }

      return Book.findOne({ title: book.title }).populate('author');
    },
    editAuthor: async (root, args) => {
      try {
        const updatedAuthor = await Author.findOneAndUpdate(
          { name: args.name },
          { born: args.setBornTo },
          { 
            new: true,
            runValidators: true 
          }
        );

        if (!updatedAuthor) {
          return null;
        }

        return updatedAuthor;
      } catch(error) {
        throw new GraphQLError(`Failed to update the Author's birth year: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.setBornTo,
            error
          }
        });
      }
    },
    removeAuthor: async (root, args) => {
      const authorToRemove = await Author.findByIdAndDelete(args.id);

      if (!authorToRemove) {
        throw new GraphQLError('Invalid or missing ID', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.id
          }
        });
      }

      return authorToRemove;
    },
    removeBook: async (root, args) => {
      const bookToRemove = await Book.findByIdAndDelete(args.id);

      if (!bookToRemove) {
        throw new GraphQLError('Invalid or missing ID', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.id
          }
        });
      }

      return bookToRemove;
    },
  },
};
