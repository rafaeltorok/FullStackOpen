// Route dependencies
import express, { NextFunction, Request, Response } from "express";
import diagnosesList from "../data/diagnoses";

// Schemas
import { NewDiagnoseSchema } from "../schemas/newDiagnose";

// TypeScript types
import type { Diagnosis } from "../../../shared/types";
import newDiagnoseParser from "../middleware/newDiagnoseParser";

const diagnosesRouter = express.Router();

diagnosesRouter.get("/", (_req: Request, res: Response) => {
  try {
    if (diagnosesList.length < 1) {
      return res.status(404).json({ error: "No diagnosis data available" });
    }
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
    const diagnose: Diagnosis | undefined = diagnosesList.find(
      (d) => d.code === req.params.id,
    );
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
      const diagnoseData: Diagnosis = NewDiagnoseSchema.parse(req.body);
      diagnosesList.push(diagnoseData);
      res.status(201).json(diagnoseData);
    } catch (err: unknown) {
      return next(err);
    }
  },
);

export default diagnosesRouter;
