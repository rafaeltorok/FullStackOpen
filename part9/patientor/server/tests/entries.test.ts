/* eslint-disable @typescript-eslint/no-floating-promises */

// Node testing library dependencies
import { test, beforeEach, describe } from "node:test";
import assert from "node:assert";
import supertest from "supertest";

// Importing the server Express app
import getApp from "../src/app";

// TypeScript types
import type { 
  HospitalEntry,
  HealthCheckEntry,
  OccupationalHealthcareEntry,
  HospitalFormValues,
  HealthCheckFormValues,
  OccupationalHealthcareFormValues,
  Patient,
  NonSensitivePatient,
} from "../../shared/types";

// app + api setup
const app = getApp();
const api = supertest(app);

// Helper functions
async function getPatient(index: number): Promise<Patient> {
  const getAllResponse = await api
    .get("/api/patients")
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const patientsList = getAllResponse.body as NonSensitivePatient[];

  // Get an specific patient by its id
  const findResponse = await api
    .get(`/api/patients/${patientsList[index].id}`)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const patientInfo = findResponse.body as Patient;
  return patientInfo;
}

async function addEntry(
  id: string,
  statusCode: number,
  contentType: RegExp,
  newEntry: unknown
): Promise<void> {
  await api
    .post(`/api/patients/${id}/entries`)
    .send(newEntry as Object)
    .expect(statusCode)
    .expect("Content-Type", contentType);
}

// Tests
// Resets the database
beforeEach(async () => {
  await api
    .post("/api/testing/reset");
});

describe("Testing the Express server", () => {
  test("The HTTP server works", async() => {
    await api
      .get("/api/ping")
      .expect("Content-Type", /text\/html/)
      .expect(200, "pong");
  });
});

describe("GET route", () => {
  test("Data is returned as JSON", async () => {
    const patientInfo = await getPatient(0);

    // Asserts the entries field is present and contains an entry inside it
    assert.strictEqual("entries" in patientInfo, true);
    assert.strictEqual(patientInfo.entries.length, 1);
    assert.deepStrictEqual(patientInfo.entries[0].type, "Hospital");
  });

  test("A Hospital entry has all the correct fields returned", async () => {
    const patientInfo = await getPatient(0);
    const entry = patientInfo.entries[0] as HospitalEntry;
    
    assert.strictEqual("entries" in patientInfo, true);
    assert.strictEqual("id" in entry, true);
    assert.strictEqual("type" in entry, true);
    assert.strictEqual("specialist" in entry, true);
    assert.strictEqual("description" in entry, true);
    assert.strictEqual("discharge" in entry, true);
    assert.strictEqual("date" in entry.discharge, true);
    assert.strictEqual("criteria" in entry.discharge, true);
  });

  test("A HealthCheck entry has all the correct fields returned", async () => {
    const patientInfo = await getPatient(4);
    const entry = patientInfo.entries[0] as HealthCheckEntry;
    
    assert.strictEqual("entries" in patientInfo, true);
    assert.strictEqual("id" in entry, true);
    assert.strictEqual("type" in entry, true);
    assert.strictEqual("specialist" in entry, true);
    assert.strictEqual("description" in entry, true);
    assert.strictEqual("healthCheckRating" in entry, true);
  });

  test("An Occupational Healthcare entry has all the required fields returned", async () => {
    const patientInfo = await getPatient(1);
    const entry = patientInfo.entries[0] as OccupationalHealthcareEntry;
    
    assert.strictEqual("entries" in patientInfo, true);
    assert.strictEqual("id" in entry, true);
    assert.strictEqual("type" in entry, true);
    assert.strictEqual("specialist" in entry, true);
    assert.strictEqual("description" in entry, true);
    assert.strictEqual("employerName" in entry, true);
  });

  test("The optional sickLeave field of an Occupational Healthcare entry is returned when present", async () => {
    const patientInfo = await getPatient(1);
    const entry = patientInfo.entries[0] as OccupationalHealthcareEntry;
    
    assert.strictEqual("entries" in patientInfo, true);
    assert.strictEqual("id" in entry, true);
    assert.strictEqual("type" in entry, true);
    assert.strictEqual("specialist" in entry, true);
    assert.strictEqual("description" in entry, true);
    assert.strictEqual("employerName" in entry, true);
    assert.strictEqual("sickLeave" in entry, true);
    assert.strictEqual("startDate" in entry.sickLeave!, true);
    assert.strictEqual("endDate" in entry.sickLeave!, true);
  });

  test("The diagnoses codes are properly returned when available", async() => {
    const patientInfo = await getPatient(1);
    const entry = patientInfo.entries[0] as OccupationalHealthcareEntry;

    // Confirms the diagnoses field is present
    assert.strictEqual("diagnosisCodes" in entry, true);

    // Checks if the correct number of diagnoses are present on the response
    assert.strictEqual(entry.diagnosisCodes!.length, 3);
  });
});

describe("POST route", () => {
  test("A new Hospital entry can be added", async() => {
    const hospitalEntry: HospitalFormValues = {
      type: "Hospital",
      date: "2025-12-31",
      specialist: "Doctor Tester",
      diagnosisCodes: [
        "M51.2"
      ],
      description: "Nothing too severe.",
      discharge: {
        date: "2026-01-10",
        criteria: "Patient has healed."
      }
    };

    // Gets a patient that has no previous entries
    let patientInfo = await getPatient(2);
    const initialEntriesLength = patientInfo.entries.length;

    // Creates a new entry for the patient
    await addEntry(patientInfo.id, 201, /application\/json/, hospitalEntry);

    // Fetches the patient data again to make sure its entries field has been updated
    patientInfo = await getPatient(2);

    // Checks if the created entry is the same as the one sent
    assert.strictEqual(patientInfo.entries[0].type, hospitalEntry.type);
    assert.strictEqual(patientInfo.entries[0].date, hospitalEntry.date);
    assert.strictEqual(patientInfo.entries[0].description, hospitalEntry.description);
    assert.strictEqual(patientInfo.entries[0].specialist, hospitalEntry.specialist);
    assert.deepStrictEqual(patientInfo.entries[0].diagnosisCodes, hospitalEntry.diagnosisCodes);
    assert.deepStrictEqual(patientInfo.entries[0].discharge, hospitalEntry.discharge);

    // Checks if the total number of entries has changed
    assert.strictEqual(patientInfo.entries.length, initialEntriesLength + 1);
  });

  test("A new HealthCheck entry can be added", async() => {
    const healthCheckEntry: HealthCheckFormValues = {
      type: "HealthCheck",
      date: "2025-12-31",
      specialist: "Doctor Tester",
      diagnosisCodes: [
        "M51.2"
      ],
      description: "Simple routine check.",
      healthCheckRating: 0
    };

    // Gets a patient that has no previous entries
    let patientInfo = await getPatient(2);
    const initialEntriesLength = patientInfo.entries.length;

    // Creates a new entry for the patient
    await addEntry(patientInfo.id, 201, /application\/json/, healthCheckEntry);

    // Fetches the patient data again to make sure its entries field has been updated
    patientInfo = await getPatient(2);

    // Checks if the created entry is the same as the one sent
    assert.strictEqual(patientInfo.entries[0].type, healthCheckEntry.type);
    assert.strictEqual(patientInfo.entries[0].date, healthCheckEntry.date);
    assert.strictEqual(patientInfo.entries[0].description, healthCheckEntry.description);
    assert.strictEqual(patientInfo.entries[0].specialist, healthCheckEntry.specialist);
    assert.deepStrictEqual(patientInfo.entries[0].diagnosisCodes, healthCheckEntry.diagnosisCodes);
    assert.strictEqual(patientInfo.entries[0].healthCheckRating, healthCheckEntry.healthCheckRating);

    // Checks if the total number of entries has changed
    assert.strictEqual(patientInfo.entries.length, initialEntriesLength + 1);
  });

  test("A new Occupational Healthcare entry can be added", async() => {
    const occupationalEntry: OccupationalHealthcareFormValues = {
      type: "OccupationalHealthcare",
      date: "2025-12-31",
      specialist: "Doctor Tester",
      diagnosisCodes: [
        "M51.2"
      ],
      description: "Moderate health issue.",
      employerName: "Company",
      sickLeave: {
        startDate: "2025-12-31",
        endDate: "2026-01-10"
      }
    };

    // Gets a patient that has no previous entries
    let patientInfo = await getPatient(2);
    const initialEntriesLength = patientInfo.entries.length;

    // Creates a new entry for the patient
    await addEntry(patientInfo.id, 201, /application\/json/, occupationalEntry);
    
    // Fetches the patient data again to make sure its entries field has been updated
    patientInfo = await getPatient(2);

    // Checks if the created entry is the same as the one sent
    assert.strictEqual(patientInfo.entries[0].type, occupationalEntry.type);
    assert.strictEqual(patientInfo.entries[0].date, occupationalEntry.date);
    assert.strictEqual(patientInfo.entries[0].description, occupationalEntry.description);
    assert.strictEqual(patientInfo.entries[0].specialist, occupationalEntry.specialist);
    assert.strictEqual(patientInfo.entries[0].employerName, occupationalEntry.employerName);
    assert.deepStrictEqual(patientInfo.entries[0].diagnosisCodes, occupationalEntry.diagnosisCodes);
    assert.deepStrictEqual(patientInfo.entries[0].sickLeave, occupationalEntry.sickLeave);

    // Checks if the total number of entries has changed
    assert.strictEqual(patientInfo.entries.length, initialEntriesLength + 1);
  });

  test("An id value is properly generated across all types", async() => {
    const hospitalEntry: HospitalFormValues = {
      type: "Hospital",
      date: "2025-12-31",
      specialist: "Doctor Tester",
      description: "Nothing too severe.",
      diagnosisCodes: [
        "M51.2"
      ],
      discharge: {
        date: "2026-01-10",
        criteria: "Patient has healed."
      }
    };

    const healthCheckEntry: HealthCheckFormValues = {
      type: "HealthCheck",
      date: "2025-12-31",
      specialist: "Doctor Tester",
      description: "Simple routine check.",
      diagnosisCodes: [
        "M51.2"
      ],
      healthCheckRating: 0
    };

    const occupationalEntry: OccupationalHealthcareFormValues = {
      type: "OccupationalHealthcare",
      date: "2025-12-31",
      specialist: "Doctor Tester",
      description: "Moderate health issue.",
      diagnosisCodes: [
        "M51.2"
      ],
      employerName: "Company",
      sickLeave: {
        startDate: "2025-12-31",
        endDate: "2026-01-10"
      }
    };

    // Gets a patient that has no previous entries
    let patientInfo = await getPatient(2);
    const initialEntriesLength = patientInfo.entries.length;

    // Adds all entries to the patient
    await addEntry(patientInfo.id, 201, /application\/json/, hospitalEntry);
    await addEntry(patientInfo.id, 201, /application\/json/, healthCheckEntry);
    await addEntry(patientInfo.id, 201, /application\/json/, occupationalEntry);

    // Fetches the patient data again to make sure its entries field has been updated
    patientInfo = await getPatient(2);

    // Checks if the id field is present across all new entries
    assert.strictEqual("id" in patientInfo.entries[0], true);
    assert.strictEqual("id" in patientInfo.entries[1], true);
    assert.strictEqual("id" in patientInfo.entries[2], true);

    // Checks if the total number of entries has changed
    assert.strictEqual(patientInfo.entries.length, initialEntriesLength + 3);
  });

  test("An id field being sent on the request will be ignore when creating new entries", async() => {
    const hospitalEntry = {
      id: "a001a00a-00a1-0a00-a010-0001a0aa0aa1",
      type: "Hospital",
      date: "2025-12-31",
      specialist: "Doctor Tester",
      description: "Nothing too severe.",
      diagnosisCodes: [
        "M51.2"
      ],
      discharge: {
        date: "2026-01-10",
        criteria: "Patient has healed."
      }
    };

    const healthCheckEntry = {
      id: "a001a00a-00a1-0a00-a010-0001a0aa0aa1",
      type: "HealthCheck",
      date: "2025-12-31",
      specialist: "Doctor Tester",
      description: "Simple routine check.",
      diagnosisCodes: [
        "M51.2"
      ],
      healthCheckRating: 0
    };

    const occupationalEntry = {
      id: "a001a00a-00a1-0a00-a010-0001a0aa0aa1",
      type: "OccupationalHealthcare",
      date: "2025-12-31",
      specialist: "Doctor Tester",
      description: "Moderate health issue.",
      diagnosisCodes: [
        "M51.2"
      ],
      employerName: "Company",
      sickLeave: {
        startDate: "2025-12-31",
        endDate: "2026-01-10"
      }
    };

    // Gets a patient that has no previous entries
    let patientInfo = await getPatient(2);
    const initialEntriesLength = patientInfo.entries.length;

    // Adds all entries to the patient
    await addEntry(patientInfo.id, 201, /application\/json/, hospitalEntry);
    await addEntry(patientInfo.id, 201, /application\/json/, healthCheckEntry);
    await addEntry(patientInfo.id, 201, /application\/json/, occupationalEntry);

    // Fetches the patient data again to make sure its entries field has been updated
    patientInfo = await getPatient(2);

    // Checks if the id generate by the server is different from the one being sent
    assert.notStrictEqual(patientInfo.entries[0].id, hospitalEntry.id);
    assert.notStrictEqual(patientInfo.entries[1].id, healthCheckEntry.id);
    assert.notStrictEqual(patientInfo.entries[2].id, occupationalEntry.id);

    // Checks if the total number of entries has changed
    assert.strictEqual(patientInfo.entries.length, initialEntriesLength + 3);
  });

  test("Multiple entries are ordered from oldest to newest added", async() => {
    const hospitalEntry: HospitalFormValues = {
      type: "Hospital",
      date: "2025-12-31",
      specialist: "Doctor Tester",
      description: "Nothing too severe.",
      diagnosisCodes: [
        "M51.2"
      ],
      discharge: {
        date: "2026-01-10",
        criteria: "Patient has healed."
      }
    };

    const healthCheckEntry: HealthCheckFormValues = {
      type: "HealthCheck",
      date: "2025-12-31",
      specialist: "Doctor Tester",
      description: "Simple routine check.",
      diagnosisCodes: [
        "M51.2"
      ],
      healthCheckRating: 0
    };

    const occupationalEntry: OccupationalHealthcareFormValues = {
      type: "OccupationalHealthcare",
      date: "2025-12-31",
      specialist: "Doctor Tester",
      description: "Moderate health issue.",
      diagnosisCodes: [
        "M51.2"
      ],
      employerName: "Company",
      sickLeave: {
        startDate: "2025-12-31",
        endDate: "2026-01-10"
      }
    };

    // Gets a patient that has no previous entries
    let patientInfo = await getPatient(2);
    const initialEntriesLength = patientInfo.entries.length;

    // Adds all entries to the patient
    await addEntry(patientInfo.id, 201, /application\/json/, hospitalEntry);
    await addEntry(patientInfo.id, 201, /application\/json/, healthCheckEntry);
    await addEntry(patientInfo.id, 201, /application\/json/, occupationalEntry);

    // Fetches the patient data again to make sure its entries field has been updated
    patientInfo = await getPatient(2);

    // Checks if the entries are properly ordered
    assert.strictEqual(patientInfo.entries[0].type, "Hospital");
    assert.strictEqual(patientInfo.entries[1].type, "HealthCheck");
    assert.strictEqual(patientInfo.entries[2].type, "OccupationalHealthcare");

    // Checks if the total number of entries has changed
    assert.strictEqual(patientInfo.entries.length, initialEntriesLength + 3);
  });

  test("The diagnosisCodes field is optional across all entry types", async() => {
    const hospitalEntry: HospitalFormValues = {
      type: "Hospital",
      date: "2025-12-31",
      specialist: "Doctor Tester",
      description: "Nothing too severe.",
      discharge: {
        date: "2026-01-10",
        criteria: "Patient has healed."
      }
    };

    const healthCheckEntry: HealthCheckFormValues = {
      type: "HealthCheck",
      date: "2025-12-31",
      specialist: "Doctor Tester",
      description: "Simple routine check.",
      healthCheckRating: 0
    };

    const occupationalEntry: OccupationalHealthcareFormValues = {
      type: "OccupationalHealthcare",
      date: "2025-12-31",
      specialist: "Doctor Tester",
      description: "Moderate health issue.",
      employerName: "Company",
      sickLeave: {
        startDate: "2025-12-31",
        endDate: "2026-01-10"
      }
    };

    // Gets a patient that has no previous entries
    let patientInfo = await getPatient(2);
    const initialEntriesLength = patientInfo.entries.length;

    // Adds all entries to the patient
    await addEntry(patientInfo.id, 201, /application\/json/, hospitalEntry);
    await addEntry(patientInfo.id, 201, /application\/json/, healthCheckEntry);
    await addEntry(patientInfo.id, 201, /application\/json/, occupationalEntry);

    // Fetches the patient data again to make sure its entries field has been updated
    patientInfo = await getPatient(2);

    // Checks if all the entries are the same as the ones being sent
    assert.strictEqual(patientInfo.entries[0].type, hospitalEntry.type);
    assert.strictEqual(patientInfo.entries[0].date, hospitalEntry.date);
    assert.strictEqual(patientInfo.entries[0].description, hospitalEntry.description);
    assert.strictEqual(patientInfo.entries[0].specialist, hospitalEntry.specialist);
    assert.deepStrictEqual(patientInfo.entries[0].discharge, hospitalEntry.discharge);
    assert.strictEqual("diagnosisCodes" in patientInfo.entries[0], false);

    assert.strictEqual(patientInfo.entries[1].type, healthCheckEntry.type);
    assert.strictEqual(patientInfo.entries[1].date, healthCheckEntry.date);
    assert.strictEqual(patientInfo.entries[1].description, healthCheckEntry.description);
    assert.strictEqual(patientInfo.entries[1].specialist, healthCheckEntry.specialist);
    assert.strictEqual(patientInfo.entries[1].healthCheckRating, healthCheckEntry.healthCheckRating);
    assert.strictEqual("diagnosisCodes" in patientInfo.entries[1], false);

    assert.strictEqual(patientInfo.entries[2].type, occupationalEntry.type);
    assert.strictEqual(patientInfo.entries[2].date, occupationalEntry.date);
    assert.strictEqual(patientInfo.entries[2].description, occupationalEntry.description);
    assert.strictEqual(patientInfo.entries[2].specialist, occupationalEntry.specialist);
    assert.strictEqual(patientInfo.entries[2].employerName, occupationalEntry.employerName);
    assert.deepStrictEqual(patientInfo.entries[2].sickLeave, occupationalEntry.sickLeave);
    assert.strictEqual("diagnosisCodes" in patientInfo.entries[2], false);

    // Checks if the total number of entries has changed
    assert.strictEqual(patientInfo.entries.length, initialEntriesLength + 3);
  });

  test("New entries can be created with an empty diagnosisCodes field", async() => {
    const hospitalEntry: HospitalFormValues = {
      type: "Hospital",
      date: "2025-12-31",
      specialist: "Doctor Tester",
      description: "Nothing too severe.",
      diagnosisCodes: [],
      discharge: {
        date: "2026-01-10",
        criteria: "Patient has healed."
      }
    };

    const healthCheckEntry: HealthCheckFormValues = {
      type: "HealthCheck",
      date: "2025-12-31",
      specialist: "Doctor Tester",
      description: "Simple routine check.",
      diagnosisCodes: [],
      healthCheckRating: 0
    };

    const occupationalEntry: OccupationalHealthcareFormValues = {
      type: "OccupationalHealthcare",
      date: "2025-12-31",
      specialist: "Doctor Tester",
      description: "Moderate health issue.",
      diagnosisCodes: [],
      employerName: "Company",
      sickLeave: {
        startDate: "2025-12-31",
        endDate: "2026-01-10"
      }
    };

    // Gets a patient that has no previous entries
    let patientInfo = await getPatient(2);
    const initialEntriesLength = patientInfo.entries.length;

    // Adds all entries to the patient
    await addEntry(patientInfo.id, 201, /application\/json/, hospitalEntry);
    await addEntry(patientInfo.id, 201, /application\/json/, healthCheckEntry);
    await addEntry(patientInfo.id, 201, /application\/json/, occupationalEntry);

    // Fetches the patient data again to make sure its entries field has been updated
    patientInfo = await getPatient(2);

    // Checks if all the entries are the same as the ones being sent
    assert.strictEqual(patientInfo.entries[0].type, hospitalEntry.type);
    assert.strictEqual(patientInfo.entries[0].date, hospitalEntry.date);
    assert.strictEqual(patientInfo.entries[0].description, hospitalEntry.description);
    assert.strictEqual(patientInfo.entries[0].specialist, hospitalEntry.specialist);
    assert.deepStrictEqual(patientInfo.entries[0].discharge, hospitalEntry.discharge);
    assert.strictEqual("diagnosisCodes" in patientInfo.entries[0], true);
    assert.strictEqual(patientInfo.entries[0].diagnosisCodes?.length, 0);

    assert.strictEqual(patientInfo.entries[1].type, healthCheckEntry.type);
    assert.strictEqual(patientInfo.entries[1].date, healthCheckEntry.date);
    assert.strictEqual(patientInfo.entries[1].description, healthCheckEntry.description);
    assert.strictEqual(patientInfo.entries[1].specialist, healthCheckEntry.specialist);
    assert.strictEqual(patientInfo.entries[1].healthCheckRating, healthCheckEntry.healthCheckRating);
    assert.strictEqual("diagnosisCodes" in patientInfo.entries[1], true);
    assert.strictEqual(patientInfo.entries[1].diagnosisCodes?.length, 0);

    assert.strictEqual(patientInfo.entries[2].type, occupationalEntry.type);
    assert.strictEqual(patientInfo.entries[2].date, occupationalEntry.date);
    assert.strictEqual(patientInfo.entries[2].description, occupationalEntry.description);
    assert.strictEqual(patientInfo.entries[2].specialist, occupationalEntry.specialist);
    assert.strictEqual(patientInfo.entries[2].employerName, occupationalEntry.employerName);
    assert.deepStrictEqual(patientInfo.entries[2].sickLeave, occupationalEntry.sickLeave);
    assert.strictEqual("diagnosisCodes" in patientInfo.entries[2], true);
    assert.strictEqual(patientInfo.entries[2].diagnosisCodes?.length, 0);

    // Checks if the total number of entries has changed
    assert.strictEqual(patientInfo.entries.length, initialEntriesLength + 3);
  });

  test("Invalid formats for the diagnosisCodes field", async() => {
    const hospitalEntry = {
      type: "Hospital",
      date: "2025-12-31",
      specialist: "Doctor Tester",
      description: "Nothing too severe.",
      diagnosisCodes: [
        123
      ],
      discharge: {
        date: "2026-01-10",
        criteria: "Patient has healed."
      }
    };

    const healthCheckEntry = {
      type: "HealthCheck",
      date: "2025-12-31",
      specialist: "Doctor Tester",
      description: "Simple routine check.",
      diagnosisCodes: {
        code: "M51.2"
      },
      healthCheckRating: 0
    };

    const occupationalEntry = {
      type: "OccupationalHealthcare",
      date: "2025-12-31",
      specialist: "Doctor Tester",
      description: "Moderate health issue.",
      diagnosisCodes: [
        true
      ],
      employerName: "Company",
      sickLeave: {
        startDate: "2025-12-31",
        endDate: "2026-01-10"
      }
    };

    // Gets a patient that has no previous entries
    let patientInfo = await getPatient(2);
    const initialEntriesLength = patientInfo.entries.length;

    // Adds all entries to the patient
    await addEntry(patientInfo.id, 400, /application\/json/, hospitalEntry);
    await addEntry(patientInfo.id, 400, /application\/json/, healthCheckEntry);
    await addEntry(patientInfo.id, 400, /application\/json/, occupationalEntry);

    // Fetches the patient data again to make sure it has not been updated
    patientInfo = await getPatient(2);

    // Checks if the total number of entries has not changed
    assert.strictEqual(patientInfo.entries.length, initialEntriesLength);
  });

  test("New entries fails if the type field is missing", async() => {
    const hospitalEntry = {
      date: "2025-12-31",
      specialist: "Doctor Tester",
      diagnosisCodes: [
        "M51.2"
      ],
      description: "Nothing too severe.",
      discharge: {
        date: "2026-01-10",
        criteria: "Patient has healed."
      }
    };

    const healthCheckEntry = {
      date: "2025-12-31",
      specialist: "Doctor Tester",
      diagnosisCodes: [
        "M51.2"
      ],
      description: "Simple routine check.",
      healthCheckRating: 0
    };

    const occupationalEntry = {
      date: "2025-12-31",
      specialist: "Doctor Tester",
      diagnosisCodes: [
        "M51.2"
      ],
      description: "Moderate health issue.",
      employerName: "Company",
      sickLeave: {
        startDate: "2025-12-31",
        endDate: "2026-01-10"
      }
    };

    // Gets a patient that has no previous entries
    let patientInfo = await getPatient(2);
    const initialEntriesLength = patientInfo.entries.length;

    // Adds all entries to the patient
    await addEntry(patientInfo.id, 400, /application\/json/, hospitalEntry);
    await addEntry(patientInfo.id, 400, /application\/json/, healthCheckEntry);
    await addEntry(patientInfo.id, 400, /application\/json/, occupationalEntry);
    
    // Fetches the patient data again to make sure its entries field hasn't changed
    patientInfo = await getPatient(2);

    // Checks if the total number of entries has not changed
    assert.strictEqual(patientInfo.entries.length, initialEntriesLength);
  });

  test("Missing description field", async() => {
    const hospitalEntry = {
      type: "Hospital",
      date: "2025-12-31",
      specialist: "Doctor Tester",
      diagnosisCodes: [
        "M51.2"
      ],
      discharge: {
        date: "2026-01-10",
        criteria: "Patient has healed."
      }
    };

    const healthCheckEntry = {
      type: "HealthCheck",
      date: "2025-12-31",
      specialist: "Doctor Tester",
      diagnosisCodes: [
        "M51.2"
      ],
      healthCheckRating: 0
    };

    const occupationalEntry = {
      type: "OccupationalHealthcare",
      date: "2025-12-31",
      specialist: "Doctor Tester",
      diagnosisCodes: [
        "M51.2"
      ],
      employerName: "Company",
      sickLeave: {
        startDate: "2025-12-31",
        endDate: "2026-01-10"
      }
    };

    // Gets a patient that has no previous entries
    let patientInfo = await getPatient(2);
    const initialEntriesLength = patientInfo.entries.length;

    // Adds all entries to the patient
    await addEntry(patientInfo.id, 400, /application\/json/, hospitalEntry);
    await addEntry(patientInfo.id, 400, /application\/json/, healthCheckEntry);
    await addEntry(patientInfo.id, 400, /application\/json/, occupationalEntry);
    
    // Fetches the patient data again to make sure its entries field hasn't changed
    patientInfo = await getPatient(2);

    // Checks if the total number of entries has not changed
    assert.strictEqual(patientInfo.entries.length, initialEntriesLength);
  });

  test("Missing date field", async() => {
    const hospitalEntry = {
      type: "Hospital",
      specialist: "Doctor Tester",
      diagnosisCodes: [
        "M51.2"
      ],
      description: "Nothing too severe.",
      discharge: {
        date: "2026-01-10",
        criteria: "Patient has healed."
      }
    };

    const healthCheckEntry = {
      type: "HealthCheck",
      specialist: "Doctor Tester",
      diagnosisCodes: [
        "M51.2"
      ],
      description: "Simple routine check.",
      healthCheckRating: 0
    };

    const occupationalEntry = {
      type: "OccupationalHealthcare",
      specialist: "Doctor Tester",
      diagnosisCodes: [
        "M51.2"
      ],
      description: "Moderate health issue.",
      employerName: "Company",
      sickLeave: {
        startDate: "2025-12-31",
        endDate: "2026-01-10"
      }
    };

    // Gets a patient that has no previous entries
    let patientInfo = await getPatient(2);
    const initialEntriesLength = patientInfo.entries.length;

    // Adds all entries to the patient
    await addEntry(patientInfo.id, 400, /application\/json/, hospitalEntry);
    await addEntry(patientInfo.id, 400, /application\/json/, healthCheckEntry);
    await addEntry(patientInfo.id, 400, /application\/json/, occupationalEntry);
    
    // Fetches the patient data again to make sure its entries field hasn't changed
    patientInfo = await getPatient(2);

    // Checks if the total number of entries has not changed
    assert.strictEqual(patientInfo.entries.length, initialEntriesLength);
  });

  test("Missing specialist field", async() => {
    const hospitalEntry = {
      type: "Hospital",
      date: "2025-12-31",
      diagnosisCodes: [
        "M51.2"
      ],
      description: "Nothing too severe.",
      discharge: {
        date: "2026-01-10",
        criteria: "Patient has healed."
      }
    };

    const healthCheckEntry = {
      type: "HealthCheck",
      date: "2025-12-31",
      diagnosisCodes: [
        "M51.2"
      ],
      description: "Simple routine check.",
      healthCheckRating: 0
    };

    const occupationalEntry = {
      type: "OccupationalHealthcare",
      date: "2025-12-31",
      diagnosisCodes: [
        "M51.2"
      ],
      description: "Moderate health issue.",
      employerName: "Company",
      sickLeave: {
        startDate: "2025-12-31",
        endDate: "2026-01-10"
      }
    };

    // Gets a patient that has no previous entries
    let patientInfo = await getPatient(2);
    const initialEntriesLength = patientInfo.entries.length;

    // Adds all entries to the patient
    await addEntry(patientInfo.id, 400, /application\/json/, hospitalEntry);
    await addEntry(patientInfo.id, 400, /application\/json/, healthCheckEntry);
    await addEntry(patientInfo.id, 400, /application\/json/, occupationalEntry);
    
    // Fetches the patient data again to make sure its entries field hasn't changed
    patientInfo = await getPatient(2);

    // Checks if the total number of entries has not changed
    assert.strictEqual(patientInfo.entries.length, initialEntriesLength);
  });

  test("Invalid date formats", async() => {
    const hospitalEntry: HospitalFormValues = {
      type: "Hospital",
      // Inverted date order
      date: "31-12-2025",
      specialist: "Doctor Tester",
      diagnosisCodes: [
        "M51.2"
      ],
      description: "Nothing too severe.",
      discharge: {
        date: "2026-01-10",
        criteria: "Patient has healed."
      }
    };

    const healthCheckEntry: HealthCheckFormValues = {
      type: "HealthCheck",
      // no dates separation
      date: "20251231",
      specialist: "Doctor Tester",
      diagnosisCodes: [
        "M51.2"
      ],
      description: "Simple routine check.",
      healthCheckRating: 0
    };

    const occupationalEntry: OccupationalHealthcareFormValues = {
      type: "OccupationalHealthcare",
      // slashes instead of dashes
      date: "2025/12/31",
      specialist: "Doctor Tester",
      diagnosisCodes: [
        "M51.2"
      ],
      description: "Moderate health issue.",
      employerName: "Company",
      sickLeave: {
        startDate: "2025-12-31",
        endDate: "2026-01-10"
      }
    };

    // Gets a patient that has no previous entries
    let patientInfo = await getPatient(2);
    const initialEntriesLength = patientInfo.entries.length;

    // Adds all entries to the patient
    await addEntry(patientInfo.id, 400, /application\/json/, hospitalEntry);
    await addEntry(patientInfo.id, 400, /application\/json/, healthCheckEntry);
    await addEntry(patientInfo.id, 400, /application\/json/, occupationalEntry);
    
    // Fetches the patient data again to make sure its entries field hasn't changed
    patientInfo = await getPatient(2);

    // Checks if the total number of entries has not changed
    assert.strictEqual(patientInfo.entries.length, initialEntriesLength);
  });

  test("Empty common required fields across all types", async() => {
    const hospitalEntry: HospitalFormValues = {
      type: "Hospital",
      date: "",
      specialist: "",
      diagnosisCodes: [
        "M51.2"
      ],
      description: "",
      discharge: {
        date: "2026-01-10",
        criteria: "Patient has healed."
      }
    };

    const healthCheckEntry: HealthCheckFormValues = {
      type: "HealthCheck",
      date: "",
      specialist: "",
      diagnosisCodes: [
        "M51.2"
      ],
      description: "",
      healthCheckRating: 0
    };

    const occupationalEntry: OccupationalHealthcareFormValues = {
      type: "OccupationalHealthcare",
      date: "",
      specialist: "",
      diagnosisCodes: [
        "M51.2"
      ],
      description: "",
      employerName: "Company",
      sickLeave: {
        startDate: "2025-12-31",
        endDate: "2026-01-10"
      }
    };

    // Gets a patient that has no previous entries
    let patientInfo = await getPatient(2);
    const initialEntriesLength = patientInfo.entries.length;

    // Adds all entries to the patient
    await addEntry(patientInfo.id, 400, /application\/json/, hospitalEntry);
    await addEntry(patientInfo.id, 400, /application\/json/, healthCheckEntry);
    await addEntry(patientInfo.id, 400, /application\/json/, occupationalEntry);
    
    // Fetches the patient data again to make sure its entries field hasn't changed
    patientInfo = await getPatient(2);

    // Checks if the total number of entries has not changed
    assert.strictEqual(patientInfo.entries.length, initialEntriesLength);
  });

  test("Invalid entry type", async() => {
    const newEntry = {
      type: "UnknownEntry",
      date: "2025-12-31",
      specialist: "Doctor Tester",
      diagnosisCodes: [
        "M51.2"
      ],
      description: "None"
    };

    // Gets a patient that has no previous entries
    let patientInfo = await getPatient(2);
    const initialEntriesLength = patientInfo.entries.length;

    // Adds all entries to the patient
    await addEntry(patientInfo.id, 400, /application\/json/, newEntry);

    // Fetches the patient data again to make sure its entries field hasn't changed
    patientInfo = await getPatient(2);

    // Checks if the total number of entries has not changed
    assert.strictEqual(patientInfo.entries.length, initialEntriesLength);
  });

  // Testing a Hospital entry specific fields
  test("Missing discharge field", async() => {
    const hospitalEntry = {
      type: "Hospital",
      date: "2025-12-31",
      specialist: "Doctor Tester",
      diagnosisCodes: [
        "M51.2"
      ],
      description: "Simple health issue."
    };

    // Gets a patient that has no previous entries
    let patientInfo = await getPatient(2);
    const initialEntriesLength = patientInfo.entries.length;

    // Adds new entry to the patient
    await addEntry(patientInfo.id, 400, /application\/json/, hospitalEntry);
    
    // Fetches the patient data again to make sure its entries field hasn't changed
    patientInfo = await getPatient(2);

    // Checks if the total number of entries has not changed
    assert.strictEqual(patientInfo.entries.length, initialEntriesLength);
  });

  test("Missing sub-fields from the discharge field", async() => {
    const noCriteria = {
      type: "Hospital",
      date: "2025-12-31",
      specialist: "Doctor Tester",
      diagnosisCodes: [
        "M51.2"
      ],
      description: "Simple health issue.",
      discharge: {
        date: "2026-01-01"
      }
    };

    const noDate = {
      type: "Hospital",
      date: "2025-12-31",
      specialist: "Doctor Tester",
      diagnosisCodes: [
        "M51.2"
      ],
      description: "Simple health issue.",
      discharge: {
        criteria: "None"
      }
    };

    // Gets a patient that has no previous entries
    let patientInfo = await getPatient(2);
    const initialEntriesLength = patientInfo.entries.length;

    // Adds new entries to the patient
    await addEntry(patientInfo.id, 400, /application\/json/, noCriteria);
    await addEntry(patientInfo.id, 400, /application\/json/, noDate);
    
    // Fetches the patient data again to make sure its entries field hasn't changed
    patientInfo = await getPatient(2);

    // Checks if the total number of entries has not changed
    assert.strictEqual(patientInfo.entries.length, initialEntriesLength);
  });

  // Testing a HealthCheck entry specific fields
  test("Missing healthCheckRating field", async() => {
    const healthCheckEntry = {
      type: "HealthCheck",
      date: "2025-12-31",
      specialist: "Doctor Tester",
      description: "None",
      diagnosisCodes: [
        "M51.2"
      ],
    };

    // Gets a patient that has no previous entries
    let patientInfo = await getPatient(2);
    const initialEntriesLength = patientInfo.entries.length;

    // Adds new entry to the patient
    await addEntry(patientInfo.id, 400, /application\/json/, healthCheckEntry);
    
    // Fetches the patient data again to make sure its entries field hasn't changed
    patientInfo = await getPatient(2);

    // Checks if the total number of entries has not changed
    assert.strictEqual(patientInfo.entries.length, initialEntriesLength);
  });

  test("Invalid healthCheckRating values", async() => {
    const outOfRangeValue = {
      type: "HealthCheck",
      date: "2025-12-31",
      specialist: "Doctor Tester",
      description: "None",
      diagnosisCodes: [
        "M51.2"
      ],
      healthCheckRating: 4
    };

    const negativeValue = {
      type: "HealthCheck",
      date: "2025-12-31",
      specialist: "Doctor Tester",
      description: "None",
      diagnosisCodes: [
        "M51.2"
      ],
      healthCheckRating: -1
    };

    const stringValue = {
      type: "HealthCheck",
      date: "2025-12-31",
      specialist: "Doctor Tester",
      description: "None",
      diagnosisCodes: [
        "M51.2"
      ],
      healthCheckRating: "Good"
    };

    // Gets a patient that has no previous entries
    let patientInfo = await getPatient(2);
    const initialEntriesLength = patientInfo.entries.length;

    // Adds new entries to the patient
    await addEntry(patientInfo.id, 400, /application\/json/, outOfRangeValue);
    await addEntry(patientInfo.id, 400, /application\/json/, negativeValue);
    await addEntry(patientInfo.id, 400, /application\/json/, stringValue);
    
    // Fetches the patient data again to make sure its entries field hasn't changed
    patientInfo = await getPatient(2);

    // Checks if the total number of entries has not changed
    assert.strictEqual(patientInfo.entries.length, initialEntriesLength);
  });

  // Testing an Occupational Healthcare entry specific fields
  test("The sick leave field is optional", async() => {
    const occupationalEntry: OccupationalHealthcareFormValues = {
      type: "OccupationalHealthcare",
      date: "2025-12-31",
      specialist: "Doctor Tester",
      diagnosisCodes: [
        "M51.2"
      ],
      description: "Moderate health issue.",
      employerName: "Company",
    };

    // Gets a patient that has no previous entries
    let patientInfo = await getPatient(2);
    const initialEntriesLength = patientInfo.entries.length;

    // Creates a new entry for the patient
    await addEntry(patientInfo.id, 201, /application\/json/, occupationalEntry);

    // Fetches the patient data again to make sure its entries field has been updated
    patientInfo = await getPatient(2);

    // Checks if the created entry is the same as the one sent
    assert.strictEqual(patientInfo.entries[0].type, occupationalEntry.type);
    assert.strictEqual(patientInfo.entries[0].date, occupationalEntry.date);
    assert.strictEqual(patientInfo.entries[0].description, occupationalEntry.description);
    assert.strictEqual(patientInfo.entries[0].specialist, occupationalEntry.specialist);
    assert.strictEqual(patientInfo.entries[0].employerName, occupationalEntry.employerName);
    assert.deepStrictEqual(patientInfo.entries[0].diagnosisCodes, occupationalEntry.diagnosisCodes);

    // Checks if the total number of entries has changed
    assert.strictEqual(patientInfo.entries.length, initialEntriesLength + 1);
  });

  test("Missing sub-fields from the sickLeave field", async() => {
    const noStartDate = {
      type: "OccupationalHealthcare",
      date: "2025-12-31",
      specialist: "Doctor Tester",
      diagnosisCodes: [
        "M51.2"
      ],
      description: "Simple health issue.",
      sickLeave: {
        endDate: "2026-01-10"
      }
    };

    const noEndDate = {
      type: "OccupationalHealthcare",
      date: "2025-12-31",
      specialist: "Doctor Tester",
      diagnosisCodes: [
        "M51.2"
      ],
      description: "Simple health issue.",
      sickLeave: {
        startDate: "2026-01-01"
      }
    };

    // Gets a patient that has no previous entries
    let patientInfo = await getPatient(2);
    const initialEntriesLength = patientInfo.entries.length;

    // Adds new entries to the patient
    await addEntry(patientInfo.id, 400, /application\/json/, noStartDate);
    await addEntry(patientInfo.id, 400, /application\/json/, noEndDate);
    
    // Fetches the patient data again to make sure its entries field hasn't changed
    patientInfo = await getPatient(2);

    // Checks if the total number of entries has not changed
    assert.strictEqual(patientInfo.entries.length, initialEntriesLength);
  });  
});
