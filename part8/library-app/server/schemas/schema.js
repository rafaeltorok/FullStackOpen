export const typeDefs = /* GraphQL */ `
  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int
  }

  type Book {
    title: String!
    published: Int!
    author: Author
    id: ID!
    genres: [String!]!
  }

  type User {
    id: ID!
    username: String!
    passwordHash: String
    favoriteGenre: String!
  }

  type Token {
    value: String!
  }

  type Mutation {
    addAuthor(name: String!, born: Int): Author

    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]!
    ): Book

    editAuthor(name: String!, setBornTo: Int!): Author

    removeAuthor(id: ID!): Author!
    removeBook(id: ID!): Book!

    createUser(
      username: String!
      password: String!
      favoriteGenre: String!
    ): User

    login(username: String!, password: String!): Token
  }

  type Query {
    authorCount: Int!
    bookCount: Int!
    allAuthors: [Author!]!
    allBooks(author: String, genre: String): [Book!]!
    me: User
  }

  type Subscription {
    authorAdded: Author!
    bookAdded: Book!
  }
`;