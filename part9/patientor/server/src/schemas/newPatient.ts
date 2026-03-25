import { Gender } from "../../../shared/types";
import z from "zod";

export const NewPatientSchema = z.object({
  name: z.string().min(1, { message: "Patient name is required" }),
  dateOfBirth: z.iso.date(),
  ssn: z.string().min(1, { message: "Patient SSN is required" }),
  gender: z.enum(Gender),
  occupation: z.string().min(1, { message: "Patient occupation is required" }),
});

export type NewPatientEntry = z.infer<typeof NewPatientSchema>;
