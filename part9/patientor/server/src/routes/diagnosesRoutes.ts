// Route dependencies
import express, { NextFunction, Request, Response } from "express";
import diagnosesService from "../services/diagnosesService";

// Schemas
import { NewDiagnoseSchema } from "../schemas/newDiagnose";

// TypeScript types
import type { Diagnosis } from "../../../shared/types";
import newDiagnoseParser from "../middleware/newDiagnoseParser";

const diagnosesRouter = express.Router();

diagnosesRouter.get("/", (_req: Request, res: Response) => {
  try {
    const diagnosesList = diagnosesService.getDiagnoses();
    return res.status(200).json(diagnosesList);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(400).json({ error: "Bad request" });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
});

diagnosesRouter.get("/:id", (req: Request, res: Response) => {
  try {
    const diagnose: Diagnosis | undefined = diagnosesService.findDiagnosis(String(req.params.id));
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

diagnosesRouter.post(
  "/",
  newDiagnoseParser,
  (
    req: Request<unknown, unknown, Diagnosis>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const data: Diagnosis = NewDiagnoseSchema.parse(req.body);
      const diagnosis: Diagnosis = diagnosesService.addDiagnose(data);
      res.status(201).json(diagnosis);
    } catch (err: unknown) {
      return next(err);
    }
  },
);

export default diagnosesRouter;
