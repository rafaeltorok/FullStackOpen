# Redux Anecdotes

## Running the app
- Install dependencies
  ```bash
  npm install
  ```

- Start the json-server to fetch data from
  ```bash
  npx json-server --watch db.json --port 3001
  ```

- Anecdotes can be fetched directly through HTTP requests on http://localhost:3001/anecdotes

- Start the React app
  ```bash
  npm run dev
  ```