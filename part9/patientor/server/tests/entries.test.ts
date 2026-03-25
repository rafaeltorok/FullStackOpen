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
  NonSensitivePatient
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

  test("The optional fields of an Occupational Healthcare are returned when present", async () => {
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

    // Creates a new patient on the server
    await api
      .post(`/api/patients/${patientInfo.id}/entries`)
      .send(hospitalEntry)
      .expect(201)
      .expect("Content-Type", /application\/json/);

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

    // Creates a new patient on the server
    await api
      .post(`/api/patients/${patientInfo.id}/entries`)
      .send(healthCheckEntry)
      .expect(201)
      .expect("Content-Type", /application\/json/);

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
    const OccupationalEntry: OccupationalHealthcareFormValues = {
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

    // Creates a new patient on the server
    await api
      .post(`/api/patients/${patientInfo.id}/entries`)
      .send(OccupationalEntry)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    // Fetches the patient data again to make sure its entries field has been updated
    patientInfo = await getPatient(2);

    // Checks if the created entry is the same as the one sent
    assert.strictEqual(patientInfo.entries[0].type, OccupationalEntry.type);
    assert.strictEqual(patientInfo.entries[0].date, OccupationalEntry.date);
    assert.strictEqual(patientInfo.entries[0].description, OccupationalEntry.description);
    assert.strictEqual(patientInfo.entries[0].specialist, OccupationalEntry.specialist);
    assert.deepStrictEqual(patientInfo.entries[0].diagnosisCodes, OccupationalEntry.diagnosisCodes);
    assert.deepStrictEqual(patientInfo.entries[0].sickLeave, OccupationalEntry.sickLeave);

    // Checks if the total number of entries has changed
    assert.strictEqual(patientInfo.entries.length, initialEntriesLength + 1);
  });
});
