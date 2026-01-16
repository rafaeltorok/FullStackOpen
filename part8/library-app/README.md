# Library App
GraphQL app using Apollo Client and Server to fetch data from a MongoDB database through the Mongoose module.

## Table of Contents
- [Usage](#usage)
- [GraphQL queries](#graphql-queries)


## Usage
- Start the frontend
  ```bash
  cd ./client && npm install && npm run dev
  ```

- Start the backend server
  ```bash
  cd ./server && npm install && npm run dev
  ```

- Access the frontend on http://localhost:5173

- Access the Apollo Sandbox on http://localhost:4000/graphql


## GraphQL queries
### Create a new user
```gql
mutation createUser($username: String!, $password: String!, $favoriteGenre: String!) {
  createUser(username: $username, password: $password, favoriteGenre: $favoriteGenre) {
    id
    username
    passwordHash
    favoriteGenre
  }
}
```

- Variables
  ```gql
  {
    "username": "admin",
    "password": "admin",
    "favoriteGenre": "fiction"
  }
  ```

### Logging in
```gql
mutation login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    value
  }
}
```

- Variables
  ```gql
  {
    "username": "admin",
    "password": "admin"
  }
  ```

### Get the currently logged in user (Requires authentication)
```gql
query Me {
  me {
    id
    username
    favoriteGenre
  }
}
```

- Headers
  ```
  Authorization: Bearer <token>
  ```

### Get all authors
```gql
query AllAuthors {
  allAuthors {
    name
    id
    born
    bookCount
  }
}
```

### Get all books
```gql
query AllBooks {
  allBooks {
    title
    published
    author {
      id
      name
      born
      bookCount
    }
    id
    genres
  }
}
```

### Total number of authors
```gql
query authorCount {
  authorCount
}
```

### Total number of books
```gql
query bookCount {
  bookCount
}
```

### Searching for a book written by a specific author
```gql
query AllBooks($author: String) {
  allBooks(author: $author) {
    title
    published
    author {
      id
      name
      born
      bookCount
    }
    id
    genres
  }
}
```

- Variables
  ```gql
  {
    "author": "Author name"
  }
  ```

### Searching books by a specific genre
```gql
query AllBooks($genre: String) {
  allBooks(genre: $genre) {
    title
    published
    author {
      id
      name
      born
      bookCount
    }
    id
    genres
  }
}
```

- Variables
  ```gql
  {
    "genre": "genre name"
  }
  ```

### Searching books by both author and genre
```gql
query AllBooks($author: String, $genre: String) {
  allBooks(author: $author, genre: $genre) {
    title
    published
    author {
      id
      name
      born
      bookCount
    }
    id
    genres
  }
}
```

- Variables
  ```gql
  {
    "author": "Author name",
    "genre": "genre"
  }
  ```

### Adding a book (Requires authentication)
```gql
mutation addBook($title: String!, $published: Int!, $author: String!, $genres: [String!]!) {
  addBook(title: $title, published: $published, author: $author, genres: $genres) {
    id
    title
    published
    genres
    author {
      id
      name
      born
      bookCount
    }
  }
}
```

- Variables
  ```gql
  {
    "title": "New book",
    "published": 2026,
    "author": "Author name",
    "genres": ["genre"]
  }
  ```

- Headers
  ```
  Authorization: Bearer <token>
  ```

### Adding an author (Requires authentication)
```gql
mutation addAuthor($name: String!, $born: Int) {
  addAuthor(name: $name, born: $born) {
    id
    name
    born
    bookCount
  }
}
```

- Variables
  ```gql
  {
    "name": "New author",
    "born": 1900
  }
  ```

- Headers
  ```
  Authorization: Bearer <token>
  ```

### Removing an author (Requires authentication)
```gql
mutation removeAuthor($removeAuthorId: ID!) {
  removeAuthor(id: $removeAuthorId) {
    id
    name
  }
}
```

- Variables
  ```gql
  {
    "removeAuthorId": "<id>"
  }
  ```

- Headers
  ```
  Authorization: Bearer <token>
  ```

### Removing a book (Requires authentication)
```gql
mutation removedBook($removeBookId: ID!) {
  removeBook(id: $removeBookId) {
    id
    title
  }
}
```

- Variables
  ```gql
  {
    "removeBookId": "<id>"
  }
  ```

- Headers
  ```
  Authorization: Bearer <token>
  ```