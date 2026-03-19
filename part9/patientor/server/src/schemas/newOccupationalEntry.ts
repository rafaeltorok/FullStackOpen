import z from "zod";

export const NewOccupationalHealthcareSchema = z.object({
  description: z.string(),
  date: z.iso.date(),
  type: z.literal("OccupationalHealthcare"),
  specialist: z.string(),
  diagnosisCodes: z.array(z.string()).optional(),
  employerName: z.string(),
  sickLeave: z.object({
    startDate: z.iso.date(),
    endDate: z.iso.date()
  }).optional()
});

export type NewOccupationalHealthcareEntry = z.infer<typeof NewOccupationalHealthcareSchema>;