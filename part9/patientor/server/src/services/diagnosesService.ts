// Data
import diagnosesData from "../data/diagnoses";

// TypeScript types
import type { Diagnosis } from "../../../shared/types";

let diagnosesList: Diagnosis[] = createInitialDiagnosesData();

function createInitialDiagnosesData(): Diagnosis[] {
  const data: Diagnosis[] = [...diagnosesData];
  return data;
}

function getDiagnoses(): Diagnosis[] {
  return diagnosesList;
}

function findDiagnosis(code: string): Diagnosis | undefined {
  const diagnose: Diagnosis | undefined = diagnosesList.find(
    (d) => d.code === code,
  );
  return diagnose;
}

function addDiagnose(diagnosis: Diagnosis): Diagnosis {
  diagnosesList.push(diagnosis);
  return diagnosis;
}

function resetDiagnoses(): void {
  diagnosesList = createInitialDiagnosesData();
}

export default {
  getDiagnoses,
  findDiagnosis,
  addDiagnose,
  resetDiagnoses,
};
