// Express dependencies
import type { Request, Response, NextFunction } from "express";
import express from "express";

// Services
import patientsService from "../services/patientsService";
import diagnosesService from "../services/diagnosesService";

const testingRouter = express.Router();

// Resets the runtime database data
testingRouter.post(
  "/reset",
  (_req: Request, res: Response, next: NextFunction) => {
    try {
      patientsService.resetPatients();
      diagnosesService.resetDiagnoses();
      res.status(204).end();
    } catch (err: unknown) {
      next(err);
    }
  },
);

export default testingRouter;