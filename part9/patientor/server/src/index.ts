import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

let pingCounter: number = 0;

const PORT: number = 3001;

app.get('/api/ping', (_req, res): void => {
  pingCounter++;
  console.log(`Ping counter: ${pingCounter}`);
  res.send(`Pong! Counter #${pingCounter}`);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});