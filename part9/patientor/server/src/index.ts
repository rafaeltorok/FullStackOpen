// Server dependencies
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

// Express routes
import diagnoseRouter from './routes/diagnosesRoutes';
import patientRouter from './routes/patientsRoutes';

// Middleware
import errorMiddleware from './middleware/errorHandler';

// Defining an Express server
const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use('/api/diagnoses', diagnoseRouter);
app.use('/api/patients', patientRouter);

const PORT: number = 3001;

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});