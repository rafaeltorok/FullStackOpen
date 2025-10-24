# Phonebook

## Table of Contents
- [Setup](#setup)
- [Web Deployment](#web-deployment)


## Setup
### Frontend
- Install dependencies and start the client
  ```bash
  cd ./part3/phonebook/frontend && npm install && npm run dev
  ```

### Backend
- Install dependencies
    ```bash
    cd ./part3/phonebook/backend && npm install
    ```

- Development build
  - Start the server
    ```bash
    npm run dev
    ```

- Production build
  - Build the frontend
    ```bash
    cd ./part3/phonebook/frontend && npm run build
    ```

  - Copy the dist folder to the root folder of the backend
    ```bash
    cp -r ./dist ../backend
    ```

  - Start the server
    ```bash
    npm run start
    ```


## Web Deployment
For this project, i've decided to host it on Render, due to the free tier option and easy setup to get it up-and-running.

Only the backend server is being deployed, using a copy of the production build (/dist folder) being served by the express backend.

[Website on Render⇗](https://phonebook-o75q.onrender.com/)