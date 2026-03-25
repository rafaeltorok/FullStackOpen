import z from "zod";

export const NewHospitalSchema = z.object({
  description: z.string().min(1, { message: "Description is required" }),
  date: z.iso.date(),
  type: z.literal("Hospital"),
  specialist: z.string().min(1, { message: "Specialist name is required" }),
  diagnosisCodes: z.array(z.string()).optional(),
  discharge: z
    .object({
      date: z.iso.date(),
      criteria: z.string().min(1, { message: "Discharge criteria is required" }),
    }),
});

export type NewHospitalEntry = z.infer<typeof NewHospitalSchema>;
