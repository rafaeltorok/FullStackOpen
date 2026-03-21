import { HealthCheckRating } from "../../../shared/types";
import z from "zod";

export const NewHealthCheckSchema = z.object({
  description: z.string(),
  date: z.iso.date(),
  type: z.literal("HealthCheck"),
  specialist: z.string(),
  diagnosisCodes: z.array(z.string()).optional(),
  healthCheckRating: z.enum(HealthCheckRating),
});

export type NewHealthCheckEntry = z.infer<typeof NewHealthCheckSchema>;
