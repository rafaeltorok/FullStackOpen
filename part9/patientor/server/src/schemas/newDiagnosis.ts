import z from "zod";

export const NewDiagnosisSchema = z.object({
  code: z.string().min(1, { message: "Diagnosis code is required" }),
  name: z.string().min(1, { message: "Diagnosis name is required" }),
  latin: z.string().optional(),
});

export type NewDiagnosisEntry = z.infer<typeof NewDiagnosisSchema>;
