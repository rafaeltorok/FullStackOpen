import type { Request, Response, NextFunction } from "express";
import z from "zod";

export default function errorMiddleware(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (error instanceof z.ZodError) {
    return res.status(400).json({ error: error.issues });
  }

  console.error(error);

  return res.status(500).json({
    error: "Internal server error"
  });
}
