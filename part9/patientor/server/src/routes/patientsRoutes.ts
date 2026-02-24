import express, { Request, Response } from 'express';
import patientData from '../data/patients';
import { Patient, PatientInfo } from '../types';
import filterSsn from '../utils/filterSsn';

const patientRouter = express.Router();

patientRouter.get('/patients', (_req: Request, res: Response) => {
  try {
    if (patientData.length < 1) {
      return res.status(404).json({ error: "No patient data available" });
    }
    const allPatientsInfo: PatientInfo[] = patientData.map(p => filterSsn(p));
    return res.status(200).json(allPatientsInfo);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(400).json({ error: "Bad request" });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
});

patientRouter.get('/patients/:id', (req: Request, res: Response) => {
  try {
    const patient: Patient | undefined = patientData.find(p => p.id === req.params.id);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    const patientInfo: PatientInfo = filterSsn(patient);
    return res.status(200).json(patientInfo);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(400).json({ error: "Bad request" });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default patientRouter;