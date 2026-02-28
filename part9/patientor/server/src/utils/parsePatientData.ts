import { Gender, NewPatientEntry } from "../types";

// Name handling
function isString(inputString: unknown): inputString is string {
  return typeof inputString === 'string' || inputString instanceof String;
}

function parseName(name: unknown): string {
  if (!name || !isString(name)) {
    throw new Error('Invalid name format');
  }
  return name;
}

// Date of birth handling
function isDate(inputDate: string): boolean {
  return Boolean(Date.parse(inputDate));
}

function parseDateOfBirth(inputDate: unknown): string {
  if (!inputDate || !isString(inputDate) || !isDate(inputDate)) {
    throw new Error('Invalid date of birth format');
  }
  return inputDate;
}

// SSN handling
function parseSsn(inputSsn: unknown): string {
  if (!inputSsn || !isString(inputSsn)) {
    throw new Error('Invalid SSN format');
  }
  return inputSsn;
}

// Gender handling
function isGender(inputGender: string): inputGender is Gender {
  return Object.values(Gender).map(v => v.toString()).includes(inputGender);
};

function parseGender(inputGender: unknown): Gender {
  if (
    !inputGender || 
    !isString(inputGender) ||
    !isGender(inputGender)
  ) {
    throw new Error('Invalid gender, must be either male, female or other');
  }
  return inputGender;
}

// Occupation handling
function parseOccupation(inputOccupation: unknown): string {
  if (!inputOccupation || !isString(inputOccupation)) {
    throw new Error('Invalid occupation format');
  }
  return inputOccupation;
}


export default function parsePatientData(patientData: unknown): NewPatientEntry {
  if ( !patientData || typeof patientData !== 'object' ) {
    throw new Error('Incorrect or missing data');
  }

  if (
    'name' in patientData &&
    'dateOfBirth' in patientData &&
    'ssn' in patientData &&
    'gender' in patientData &&
    'occupation' in patientData
  ) {
    const newPatient: NewPatientEntry = {
      name: parseName(patientData.name),
      dateOfBirth: parseDateOfBirth(patientData.dateOfBirth),
      ssn: parseSsn(patientData.ssn),
      gender: parseGender(patientData.gender),
      occupation: parseOccupation(patientData.occupation)
    };

    return newPatient;
  }

  throw new Error('Invalid data: missing fields');
};