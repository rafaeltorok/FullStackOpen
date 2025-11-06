# BlogList

## Table of Contents
- [Running the app](#running-the-app)
- [CRUD operations](#crud-operations)

## Running the app
### In production mode
```bash
npm start
```

### In development mode
This mode uses nodemon to automatically sync the modified code while running
```bash
npm run dev
```

### Testing mode
From the root folder of the bloglist app
```bash
npm run test -- ./src/tests/blog_api.test.js
```

### ESLint
Linting was implemented to the app and can be used with
```bash
npm run lint
```


## CRUD operations
### GET
Fetch all blogs
```bash
curl -X GET http://localhost:3003/api/blogs
```

Fetch all users
```bash
curl -X GET http://localhost:3003/api/users
```

### POST
Create a new blog (likes field is **optional**)
```bash
curl -X POST http://localhost:3003/api/blogs -H "Content-Type: application/json" -d '{ "title":"My blog", "author":"The blogger", "url":"https://myblog.com", "likes":10 }'
```

Create a new user
```bash
curl -X POST http://localhost:3003/api/users -H "Content-Type: application/json" -d '{ "username":"admin", "name":"The admin", "password":"my_passwd" }'
```

Logging in
```bash
curl -X POST http://localhost:3003/api/login -H "Content-Type: application/json" -d '{ "username":"admin", "password":"my_passwd" }'
```

### DELETE
Delete a blog
```bash
curl -X DELETE http://localhost:3003/api/blogs/<id>
```

### PUT
Update the number of likes of a blog
```bash
curl -X PUT http://localhost:3003/api/blogs/<id> -H "Content-Type: application/json" -d '{ "likes":10 }'
```