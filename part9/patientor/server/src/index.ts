import express from 'express';
import cors from 'cors';
import diagnoseRouter from './routes/diagnosesRoutes';
import patientRouter from './routes/patientsRoutes';

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api', diagnoseRouter);
app.use('/api', patientRouter);

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