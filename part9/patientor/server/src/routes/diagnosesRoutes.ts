import express, { Request, Response } from 'express';
import diagnosesData from '../data/diagnoses';
import { Diagnosis } from '../types';

const diagnoseRouter = express.Router();

diagnoseRouter.get('/diagnoses', (_req: Request, res: Response) => {
  try {
    if (diagnosesData.length < 1) {
      return res.status(404).json({ error: "No diagnosis data available" });
    }
    return res.status(200).json(diagnosesData);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(400).json({ error: "Bad request" });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
});

diagnoseRouter.get('/diagnoses/:id', (req: Request, res: Response) => {
  try {
    const diagnose: Diagnosis | undefined = diagnosesData.find(d => d.code === req.params.id);
    if (!diagnose) {
      return res.status(404).json({ error: "Diagnosis not found" });
    }
    return res.status(200).json(diagnose);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(400).json({ error: "Bad request" });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default diagnoseRouter;