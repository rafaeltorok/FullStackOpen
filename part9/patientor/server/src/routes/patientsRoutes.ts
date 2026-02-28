// Server dependencies
import express from 'express';
import patientsList from '../data/patients';
import { v4 as uuidv4 } from 'uuid';

// Utils
import filterSsn from '../utils/filterSsn';
import parsePatientData from '../utils/parsePatientData';

// TypeScript types
import type { Request, Response } from 'express';
import type { NewPatientEntry, Patient, PatientInfo } from '../types';

const patientRouter = express.Router();

// GET all patients
patientRouter.get('/', (_req: Request, res: Response): unknown => {
  try {
    if (patientsList.length < 1) {
      return res.status(404).json({ error: "No patient data available" });
    }
    const allPatientsInfo: PatientInfo[] = patientsList.map(p => filterSsn(p));
    return res.status(200).json(allPatientsInfo);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(400).json({ error: "Bad request" });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET a patient by the id
patientRouter.get('/:id', (req: Request, res: Response): unknown => {
  try {
    const patient: Patient | undefined = patientsList.find(p => p.id === req.params.id);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    const patientInfo: PatientInfo = filterSsn(patient);
    return res.status(200).json(patientInfo);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(400).json({ error: err.message });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST a new patient
patientRouter.post('/', (req: Request, res: Response): unknown => {
  try {
    const patientData: NewPatientEntry = parsePatientData(req.body);
    const newPatientEntry: Patient = {
      id: uuidv4(),
      ...patientData
    };
    patientsList.push(newPatientEntry);
    const patientInfo: PatientInfo = filterSsn(newPatientEntry);
    return res.status(201).json(patientInfo);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(400).json({ error: err.message });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default patientRouter;