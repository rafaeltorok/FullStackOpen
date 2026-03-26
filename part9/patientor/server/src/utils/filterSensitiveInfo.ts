import { Patient, NonSensitivePatient } from "../../../shared/types";

export default function filterSensitiveInfo(
  patient: Patient,
): NonSensitivePatient {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { ssn, entries, ...otherFields } = patient;
  const patientInfo: NonSensitivePatient = otherFields;
  return patientInfo;
}
