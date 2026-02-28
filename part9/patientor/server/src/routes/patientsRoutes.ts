// Server dependencies
import express from 'express';
import patientsList from '../data/patients';
import { v4 as uuidv4 } from 'uuid';

// Schemas
import { NewPatientSchema } from '../schemas/newPatient';

// Utils
import filterSsn from '../utils/filterSsn';

// TypeScript types
import type { NextFunction, Request, Response } from 'express';
import type { NewPatientEntry, Patient, PatientInfo } from '../types';
import newPatientParser from '../middleware/newPatientParser';

const patientRouter = express.Router();

// GET all patients
patientRouter.get('/', (_req: Request, res: Response, next: NextFunction) => {
  try {
    if (patientsList.length < 1) {
      res.status(404).json({ error: "No patient data available" }).end();
      return;
    }
    const allPatientsInfo: PatientInfo[] = patientsList.map(p => filterSsn(p));
    res.status(200).json(allPatientsInfo);
  } catch (err: unknown) {
    next(err);
  }
});

// GET a patient by the id
patientRouter.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const patient: Patient | undefined = patientsList.find(p => p.id === req.params.id);
    if (!patient) {
      res.status(404).json({ error: "Patient not found" }).end();
      return;
    }
    const patientInfo: PatientInfo = filterSsn(patient);
    res.status(200).json(patientInfo);
  } catch (err: unknown) {
    next(err);
  }
});

// POST a new patient
patientRouter.post(
  '/', newPatientParser, (
    req: Request<unknown, unknown, NewPatientEntry>, 
    res: Response<PatientInfo>, 
    next: NextFunction
  ) => {
  try {
    const patientData: NewPatientEntry = NewPatientSchema.parse(req.body);
    const newPatientEntry: Patient = {
      id: uuidv4(),
      ...patientData
    };
    patientsList.push(newPatientEntry);
    const patientInfo: PatientInfo = filterSsn(newPatientEntry);
    res.status(201).json(patientInfo);
  } catch (err: unknown) {
    next(err);
  }
});

export default patientRouter;