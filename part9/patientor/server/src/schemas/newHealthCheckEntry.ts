import { HealthCheckRating } from "../../../shared/types";
import z from "zod";

export const NewHealthCheckSchema = z.object({
  description: z.string().min(1, { message: "Description is required" }),
  date: z.iso.date(),
  type: z.literal("HealthCheck"),
  specialist: z.string().min(1, { message: "Specialist name is required" }),
  diagnosisCodes: z.array(z.string()).optional(),
  healthCheckRating: z.enum(HealthCheckRating),
});

export type NewHealthCheckEntry = z.infer<typeof NewHealthCheckSchema>;
