import { gql } from "@apollo/client";

const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      id
      born
      bookCount
    }
  }
`;

const ALL_BOOKS = gql`
  query allBooks($genre: String) {
    allBooks(genre: $genre) {
      title
      published
      author {
        name
      }
      id
      genres
    }
  }
`;

const ADD_BOOK = gql`
  mutation addBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      id
      title
      author {
        name
      }
      published
      genres
    }
  }
`;

const EDIT_AUTHOR = gql`
  mutation editAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      id
      name
      born
      bookCount
    }
  }
`;

const REMOVE_AUTHOR = gql`
  mutation removeAuthor($id: ID!) {
    removeAuthor(id: $id) {
      name
    }
  }
`;

const REMOVE_BOOK = gql`
  mutation removeBook($id: ID!) {
    removeBook(id: $id) {
      title
    }
  }
`;

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;

const ME = gql`
  query {
    me {
      username
      favoriteGenre
    }
  }
`;

export {
  ALL_AUTHORS,
  ALL_BOOKS,
  ADD_BOOK,
  EDIT_AUTHOR,
  REMOVE_AUTHOR,
  REMOVE_BOOK,
  LOGIN_USER,
  ME,
};
