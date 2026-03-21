import { NewDiagnoseSchema } from "../schemas/newDiagnose";
import type { Request, Response, NextFunction } from "express";

export default function newDiagnoseParser(req: Request, _res: Response, next: NextFunction) { 
  try {
    const result = NewDiagnoseSchema.parse(req.body);
    req.body = result;
    next();
  } catch (error: unknown) {
    next(error);
  }
};