import z from "zod";

export const NewOccupationalHealthcareSchema = z.object({
  description: z.string().min(1, { message: "Description is required" }),
  date: z.iso.date(),
  type: z.literal("OccupationalHealthcare"),
  specialist: z.string().min(1, { message: "Specialist name is required" }),
  diagnosisCodes: z.array(z.string()).optional(),
  employerName: z.string().min(1, { message: "Employer name is required" }),
  sickLeave: z
    .object({
      startDate: z.iso.date(),
      endDate: z.iso.date(),
    })
    .optional(),
});

export type NewOccupationalHealthcareEntry = z.infer<
  typeof NewOccupationalHealthcareSchema
>;
