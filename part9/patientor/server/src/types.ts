import { NewPatientSchema } from "./schemas/newPatient";
import z from "zod";

export interface Entry {
  id: string;
  description: string;
  date: Date;
  specialist: string;
  diagnosisCodes?: Diagnosis[];
}

export interface Diagnosis {
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

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: Gender;
  occupation: string;
  entries: Entry[];
};

export type NonSensitivePatient = Omit<Patient, 'ssn' | 'entries'>;

export type PatientInfo = Omit<Patient, "ssn">;