# BlogList app

## Table of Contents
- [Setup](#setup)
- [CRUD operations](#crud-operations)
- [Prettier](#prettier)


## Setup
### Frontend
- Install dependencies
  ```bash
  cd ./client && npm install
  ```

- Start the frontend
  ```bash
  npm run dev
  ```

- Access on http://localhost:5173

### Backend
- Install dependencies
  ```bash
  cd ./server && npm install
  ```

- Production mode
  ```bash
  npm start
  ```

- Development mode
  ```bash
  npm run dev
  ```

- Testing mode
  ```bash
  cd ./server && npm run test -- ./src/tests/blog_api.test.js
  ```

- ESLint
  ```bash
  cd ./server && npm run lint
  ```


## CRUD operations
### GET
- Fetch all blogs
  ```bash
  curl -X GET http://localhost:3003/api/blogs
  ```

- Fetch all users
  ```bash
  curl -X GET http://localhost:3003/api/users
  ```

### POST
- Create a new blog (likes field is **optional**)
  ```bash
  curl -X POST http://localhost:3003/api/blogs -H "Content-Type: application/json" -d '{ "title":"My blog", "author":"The blogger", "url":"https://myblog.com", "likes":10 }'
  ```

- Create a new user
  ```bash
  curl -X POST http://localhost:3003/api/users -H "Content-Type: application/json" -d '{ "username":"admin", "name":"The admin", "password":"my_passwd" }'
  ```

- Logging in
  ```bash
  curl -X POST http://localhost:3003/api/login -H "Content-Type: application/json" -d '{ "username":"admin", "password":"my_passwd" }'
  ```

### DELETE
- Delete a blog
  ```bash
  curl -X DELETE http://localhost:3003/api/blogs/<id>
  ```

### PUT
- Update the number of likes of a blog
  ```bash
  curl -X PUT http://localhost:3003/api/blogs/<id> -H "Content-Type: application/json" -d '{ "likes":10 }'
  ```


## Prettier
### Usage
- Frontend
  ```bash
  cd ./client && npx prettier --check .
  ```

- Backend
  ```bash
  cd ./server && npx prettier --check .
  ```

- To fix the issues found
  ```bash
  npx prettier --write .
  ```