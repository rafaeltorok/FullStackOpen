import { NewPatientSchema } from "./schemas/newPatient";
import z from "zod";

export type Diagnosis = {
  code: string;
  name: string;
  latin?: string;
};

export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other'
};

export type NewPatientEntry = z.infer<typeof NewPatientSchema>;

export type Patient = {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: Gender;
  occupation: string;
};

export type PatientInfo = Omit<Patient, "ssn">;