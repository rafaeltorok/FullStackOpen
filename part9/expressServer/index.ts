import express from 'express';
import router from './routes/routes';

const app = express();
app.use(express.json());

app.use('/', router);

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;