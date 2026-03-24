// Dependencies
import filterSensitiveInfo from "../utils/filterSensitiveInfo";
import { v4 as uuidv4 } from "uuid";

// Data
import patientsData from "../data/patients";

// TypeScript types
import type { 
  Patient, 
  NonSensitivePatient, 
  PatientFormValues, 
  Entry, 
  NewEntry
} from "../../../shared/types";

// Patients data services
let patientsList: Patient[] = getInitialPatientData();

function getInitialPatientData(): Patient[] {
  const data = patientsData.map((patient) => ({
    ...patient,
    entries: patient.entries ?? [],
  }));
  return data;
}

function getPatients(): NonSensitivePatient[] {
  const allPatientsInfo: NonSensitivePatient[] = patientsList.map((p) =>
    filterSensitiveInfo(p),
  );
  return allPatientsInfo;
}

function findPatient(id: string): Patient | undefined {
  const patient: Patient | undefined = patientsList.find(
    (p) => p.id === id,
  );
  return patient;
}

function addPatient(patientData: PatientFormValues): NonSensitivePatient {
  const newPatientEntry: Patient = {
    id: uuidv4(),
    ...patientData,
    entries: [],
  };
  patientsList.push(newPatientEntry);
  const patientInfo: NonSensitivePatient = filterSensitiveInfo(newPatientEntry);
  return patientInfo;
}

function resetPatients(): void {
  patientsList = getInitialPatientData();
}

// Entries data services
function addEntryToPatient(patient: Patient, entryData: NewEntry): Entry {
  const newEntry: Entry = {
        id: uuidv4(),
        ...entryData,
      };
  patient.entries = [...patient.entries, newEntry];
  return newEntry;
}

export default {
  getPatients,
  findPatient,
  addPatient,
  resetPatients,
  addEntryToPatient
};