import { authors, books } from "../data.js"
import { v1 as uuid } from 'uuid'


export const typeDefs = /* GraphQL */ `
  type Author {
    name: String!,
    id: ID!,
    born: Int,
    bookCount: Int
  }

  type Book {
    title: String!,
    published: Int!,
    author: String!,
    id: ID!,
    genres: [String!]!
  }

  type Mutation {
    addAuthor(
      name: String!
      born: Int
    ): Author

    addBook(
      title: String!,
      published: Int!,
      author: String!,
      genres: [String!]!
    ): Book
  }

  type Query {
    authorCount: Int!,
    bookCount: Int!,
    allAuthors: [Author!]!,
    allBooks(author: String, genre: String): [Book!]!
  }
`

export const resolvers = {
  Query: {
    authorCount: () => authors.length,
    bookCount: () => books.length,
    allAuthors: () => authors,
    allBooks: (root, args) => {
      let filteredBooks = books

      if (args.author) {
        filteredBooks = filteredBooks.filter(b => b.author === args.author)
      }
      if (args.genre) {
        filteredBooks = filteredBooks.filter(b => b.genres.includes(args.genre))
      }

      return filteredBooks
    }
  },
  Author: {
    bookCount: (root) => {
      return books.filter(book => book.author === root.name).length
    }
  },
  Mutation: {
    addAuthor: (root, args) => {
      if (authors.find(a => a.name === args.name)) {
        throw new GraphQLError(`Author name must be unique: ${args.name}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name
          }
        })
      }
      const author = { ...args, id: uuid() }
      authors = authors.concat(author)
      return author
    },
    addBook: (root, args) => {
      if (books.find(b => b.name === args.name)) {
        throw new GraphQLError(`Book title must be unique: ${args.name}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name
          }
        })
      }
      const book = { ...args, id: uuid() }
      books = books.concat(book)
      return book
    }
  }
}
