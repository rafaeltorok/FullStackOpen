import { Patient, PatientInfo } from "../types";

export default function filterSsn(patient: Patient): PatientInfo {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { ssn, ...otherFields } = patient;
  const patientInfo: PatientInfo = otherFields;
  return patientInfo;
}