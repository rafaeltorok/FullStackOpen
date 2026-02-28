import type { Request, Response, NextFunction } from "express";
import z from "zod";

export default function errorMiddleware (error: unknown, _req: Request, res: Response, next: NextFunction) { 
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};