// Server dependencies
import express from "express";
import cors from "cors";
import morgan from "morgan";

// Express routes
import diagnosesRouter from "./routes/diagnosesRoutes";
import patientRouter from "./routes/patientsRoutes";
import testingRouter from "./routes/testing";

// Middleware
import errorMiddleware from "./middleware/errorHandler";

// TypeScript types
import type { Request, Response } from "express";

function getApp() {
  const app = express();
  app.use(express.json());
  app.use(cors());
  app.use(express.static("dist"));
  app.use(
    morgan(":method :url :status :res[content-length] - :response-time ms"),
  );
  app.use("/api/diagnoses", diagnosesRouter);
  app.use("/api/patients", patientRouter);
  app.get("/api/ping", (_req: Request, res: Response) => {
    res.status(200).send("pong");
  });

  // Testing route to reset the database data
  if (process.env.NODE_ENV === "test") {
    app.use("/api/testing", testingRouter);
  }

  app.use(errorMiddleware);
  return app;
}

export default getApp;
