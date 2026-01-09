import { authors, books } from "../data"

export const typeDefs = /* GraphQL */ `
  type Author {
    name: String!,
    id: ID!,
    born: Int!,
  }

  type Book {
    title: String!,
    published: Int!,
    author: String!,
    id: ID!,
    genres: [String!]!
  }
`

export const resolvers = {
  Query: {
    allAuthors: () => authors,
    allBooks: () => books,
    findAuthor: (root, args) => 
      authors.find(a => a.id === args.id),
    findBook: (root, args) =>
      books.find(b => b.id === args.id)
  }
}
