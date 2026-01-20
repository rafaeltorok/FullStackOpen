import { ALL_AUTHORS } from '../queries.js';
import { ALL_BOOKS } from '../graphql/queries.js';

export const addAuthorToCache = (cache, authorToAdd) => {
  cache.updateQuery({ query: ALL_AUTHORS }, ({ allAuthors }) => {
    const authorExists = allAuthors.some(
      (author) => author.id === authorToAdd.id,
    )

    if (authorExists) {
      return { allAuthors }
    }

    return {
      allAuthors: allAuthors.concat(authorToAdd),
    }
  });
};

export const addBookToCache = (cache, bookToAdd) => {
  cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
    const bookExists = allBooks.some(
      (book) => book.id === bookToAdd.id,
    )

    if (bookExists) {
      return { allBooks }
    }

    return {
      allBooks: allBooks.concat(bookToAdd),
    }
  });
};