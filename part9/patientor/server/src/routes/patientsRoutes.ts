// Route dependencies
import express from "express";
import patientsService from "../services/patientsService";

// Middleware
import newPatientParser from "../middleware/newPatientParser";
import newEntryParser from "../middleware/newEntryParser";

// TypeScript types
import type { NextFunction, Request, Response } from "express";
import type { Patient, Entry, NonSensitivePatient, NewEntry } from "../../../shared/types";
import type { NewPatientEntry } from "../schemas/newPatient";

const patientRouter = express.Router();

// GET all patients
patientRouter.get("/", (_req: Request, res: Response, next: NextFunction) => {
  try {
    const allPatientsInfo: NonSensitivePatient[] = patientsService.getPatients();
    res.status(200).json(allPatientsInfo);
  } catch (err: unknown) {
    next(err);
  }
});

// GET a patient by the id
patientRouter.get("/:id", (req: Request, res: Response, next: NextFunction) => {
  try {
    const patient: Patient | undefined = patientsService.findPatient(String(req.params.id));
    if (!patient) {
      res.status(404).json({ error: "Patient not found" }).end();
      return;
    }
    res.status(200).json(patient);
  } catch (err: unknown) {
    return next(err);
  }
});

// POST a new patient
patientRouter.post(
  "/",
  newPatientParser,
  (
    req: Request<unknown, unknown, NewPatientEntry>,
    res: Response<NonSensitivePatient>,
    next: NextFunction,
  ) => {
    try {
      const newPatientEntry: NonSensitivePatient = patientsService.addPatient(req.body);
      res.status(201).json(newPatientEntry);
    } catch (err: unknown) {
      return next(err);
    }
  },
);

// POST a new entry
patientRouter.post(
  "/:id/entries",
  newEntryParser,
  (
    req: Request<{ id: string }, unknown, NewEntry>,
    res: Response<Entry>,
    next: NextFunction,
  ) => {
    try {
      const entryData: NewEntry = req.body;
      const patient: Patient | undefined = patientsService.findPatient(String(req.params.id));

      if (!patient) return res.status(404).end();

      const newEntry: Entry = patientsService.addEntryToPatient(patient, entryData);
      return res.status(201).json(newEntry);
    } catch (err: unknown) {
      return next(err);
    }
  },
);

export default patientRouter;
