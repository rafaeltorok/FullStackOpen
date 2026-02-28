import { NewPatientSchema } from "../schemas/newPatient";
import type { Request, Response, NextFunction } from "express";

export default function newPatientParser(req: Request, _res: Response, next: NextFunction) { 
  try {
    NewPatientSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};