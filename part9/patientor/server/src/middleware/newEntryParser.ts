// Zod dependencies
import z from "zod";

// Entry schemas
import { NewHospitalSchema } from "../schemas/newHospitalEntry";
import { NewHealthCheckSchema } from "../schemas/newHealthCheckEntry";
import { NewOccupationalHealthcareSchema } from "../schemas/newOccupationalEntry";

// TypeScript types
import type { Request, Response, NextFunction } from "express";
import { NewEntry } from "../../../shared/types";

export default function newEntryParser(
  req: Request<{ id: string }, unknown, NewEntry>,
  _res: Response,
  next: NextFunction,
) {
  try {
    const NewEntrySchema = z.discriminatedUnion("type", [
      NewHospitalSchema,
      NewHealthCheckSchema,
      NewOccupationalHealthcareSchema,
    ]);

    req.body = NewEntrySchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
}
