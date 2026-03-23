import type { Request, Response, NextFunction } from "express";
import z from "zod";

export default function errorMiddleware(
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  if (error instanceof z.ZodError) {
    return res.status(400).json({ error: error.issues });
  } else {
    return next(error);
  }
}
