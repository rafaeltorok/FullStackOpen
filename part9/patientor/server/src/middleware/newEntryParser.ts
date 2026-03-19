import { NewHealthCheckSchema } from "../schemas/newHealthCheckEntry";
import { NewHospitalSchema } from "../schemas/newHospitalEntry";
import { NewOccupationalHealthcareSchema } from "../schemas/newOccupationalEntry";
import type { Request, Response, NextFunction } from "express";

export default function newEntryParser(req: Request, _res: Response, next: NextFunction) {
  function exhaustiveMatchingGuard(_never: never) {
    throw new Error('Invalid operation type');
  }

  try {
    switch (req.body.type) {
      case "HealthCheck":
        req.body = NewHealthCheckSchema.parse(req.body);
        return next();
      case "Hospital":
        req.body = NewHospitalSchema.parse(req.body);
        return next();
      case "OccupationalHealthcare":
        req.body = NewOccupationalHealthcareSchema.parse(req.body);
        return next();
      default:
        return exhaustiveMatchingGuard(req.body.type);
    }
  } catch (error: unknown) {
    next(error);
  }
};