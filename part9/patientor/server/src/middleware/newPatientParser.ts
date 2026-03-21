import { NewPatientSchema } from "../schemas/newPatient";
import type { Request, Response, NextFunction } from "express";

export default function newPatientParser(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    const result = NewPatientSchema.parse(req.body);
    req.body = result;
    next();
  } catch (error: unknown) {
    next(error);
  }
}
