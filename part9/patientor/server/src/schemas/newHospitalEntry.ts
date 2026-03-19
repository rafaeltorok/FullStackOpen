import z from "zod";

export const NewHospitalSchema = z.object({
  description: z.string(),
  date: z.iso.date(),
  type: z.literal("Hospital"),
  specialist: z.string(),
  diagnosisCodes: z.array(z.string()).optional(),
  discharge: z.object({
    date: z.iso.date(),
    criteria: z.string()
  }).optional()
});

export type NewHospitalEntry = z.infer<typeof NewHospitalSchema>;