/* eslint-disable @typescript-eslint/no-floating-promises */

// Node testing library dependencies
import { test, beforeEach, describe } from "node:test";
import assert from "node:assert";
import supertest from "supertest";

// Importing the server Express app
import getApp from "../src/app";

// Services
import patientsService from "../src/services/patientsService";

// TypeScript types
import type { 
  Patient,
  NonSensitivePatient,  
  PatientFormValues
} from "../../shared/types";
import { Gender } from "../../shared/types";

// app + api setup
const app = getApp();
const api = supertest(app);

// Stores the initial number of patients
const initialPatientListLength: number = patientsService.getPatients().length;

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
    await api
      .get("/api/patients")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("All patients are returned", async () => {
    const response = await api
      .get("/api/patients");
    const patientsList = response.body as NonSensitivePatient[];
    assert.strictEqual(patientsList.length, initialPatientListLength);
  });

  test("Sensitive info is filtered from the patients list", async() => {
    const response = await api
      .get("/api/patients")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const patientsList = response.body as NonSensitivePatient[];

    assert.strictEqual("ssn" in patientsList[0], false);
    assert.strictEqual("entries" in patientsList[0], false);
  });

  test("An individual patient info is correctly returned", async() => {
    // Get the list with all available patients
    const getAllResponse = await api
      .get("/api/patients")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const patientsList = getAllResponse.body as NonSensitivePatient[];

    // Get an specific patient by its id
    const findResponse = await api
      .get(`/api/patients/${patientsList[0].id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const patientInfo = findResponse.body as Patient;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { ssn, entries, ...otherFields }: Patient = patientInfo;
    const patient: NonSensitivePatient = otherFields;

    assert.deepStrictEqual(patientsList[0], patient);
  });

  test("Sensitive fields are present on a patient's full info", async() => {
    // Get the list with all available patients
    const getAllResponse = await api
      .get("/api/patients")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const patientsList = getAllResponse.body as NonSensitivePatient[];

    // Get an specific patient by its id
    const findResponse = await api
      .get(`/api/patients/${patientsList[0].id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const patientInfo = findResponse.body as Patient;

    // Checks if sensitive fields are present on the full patient info
    assert.strictEqual("ssn" in patientInfo, true);
    assert.strictEqual("entries" in patientInfo, true);
  });

  test("A non-existing id returns a proper error response", async() => {
    // Get an specific patient by its id
    const response = await api
      .get(`/api/patients/0101010101-101010`)
      .expect(404)
      .expect("Content-Type", /application\/json/);

    assert.deepStrictEqual(response.body, { error: "Patient not found" });
  });
});

describe("POST route", () => {
  test("A new patient can be added", async() => {
    const patientData: PatientFormValues = {
      name: "Anonymous",
      ssn: "010101-01",
      dateOfBirth: "1980-01-01",
      gender: Gender.Other,
      occupation: "None"
    };

    // Creates a new patient on the server
    const postResponse = await api
      .post("/api/patients")
      .send(patientData)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const newPatient: Patient = postResponse.body as Patient;

    // Checks if the created patient info is the same as the one sent
    assert.strictEqual(newPatient.name, patientData.name);
    assert.strictEqual(newPatient.dateOfBirth, patientData.dateOfBirth);
    assert.strictEqual(newPatient.gender, patientData.gender);
    assert.strictEqual(newPatient.occupation, patientData.occupation);

    // Checks if the total number of patients has changed
    assert.strictEqual(patientsService.getPatients().length, initialPatientListLength + 1);
  });

  test("Empty required fields", async() => {
    const patientData = {
      name: "",
      ssn: "",
      dateOfBirth: "",
      gender: "",
      occupation: ""
    };

    // Creates a new patient on the server
    await api
      .post("/api/patients")
      .send(patientData)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    // Checks if the total number of patients has changed
    assert.strictEqual(patientsService.getPatients().length, initialPatientListLength);
  });

  test("Invalid day for the date of birth", async() => {
    const patientData: PatientFormValues = {
      name: "Anonymous",
      ssn: "010101-01",
      dateOfBirth: "2000-02-31",
      gender: Gender.Other,
      occupation: "None"
    };

    // Creates a new patient on the server
    await api
      .post("/api/patients")
      .send(patientData)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    // Checks if the total number of patients has changed
    assert.strictEqual(patientsService.getPatients().length, initialPatientListLength);
  });

  test("Invalid input format for the date of birth", async() => {
    const patientData: PatientFormValues = {
      name: "Anonymous",
      ssn: "010101-01",
      dateOfBirth: "A long time ago...",
      gender: Gender.Other,
      occupation: "None"
    };

    // Creates a new patient on the server
    await api
      .post("/api/patients")
      .send(patientData)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    // Checks if the total number of patients has changed
    assert.strictEqual(patientsService.getPatients().length, initialPatientListLength);
  });

  test("Invalid gender", async() => {
    const patientData = {
      name: "Anonymous",
      ssn: "010101-01",
      dateOfBirth: "1980-01-01",
      gender: "gender",
      occupation: "None"
    };

    // Creates a new patient on the server
    await api
      .post("/api/patients")
      .send(patientData)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    // Checks if the total number of patients has changed
    assert.strictEqual(patientsService.getPatients().length, initialPatientListLength);
  });

  test("Sending an empty request body", async() => {
    const patientData = {};

    // Creates a new patient on the server
    await api
      .post("/api/patients")
      .send(patientData)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    // Checks if the total number of patients has changed
    assert.strictEqual(patientsService.getPatients().length, initialPatientListLength);
  });

  test("Missing required fields", async() => {
    const noName = {
      ssn: "010101-01",
      dateOfBirth: "2000-02-31",
      gender: Gender.Other,
      occupation: "None"
    };

    await api
      .post("/api/patients")
      .send(noName)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    // Checks if the total number of patients has changed
    assert.strictEqual(patientsService.getPatients().length, initialPatientListLength);

    const noSSN = {
      name: "Anonymous",
      dateOfBirth: "2000-02-31",
      gender: Gender.Other,
      occupation: "None"
    };

    await api
      .post("/api/patients")
      .send(noSSN)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(patientsService.getPatients().length, initialPatientListLength);

    const noDateOfBirth = {
      name: "Anonymous",
      ssn: "010101-01",
      gender: Gender.Other,
      occupation: "None"
    };

    await api
      .post("/api/patients")
      .send(noDateOfBirth)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(patientsService.getPatients().length, initialPatientListLength);

    const noGender = {
      name: "Anonymous",
      ssn: "010101-01",
      dateOfBirth: "2000-02-31",
      occupation: "None"
    };

    await api
      .post("/api/patients")
      .send(noGender)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(patientsService.getPatients().length, initialPatientListLength);

    const noOccupation = {
      name: "Anonymous",
      ssn: "010101-01",
      dateOfBirth: "2000-02-31",
      gender: Gender.Other
    };

    await api
      .post("/api/patients")
      .send(noOccupation)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(patientsService.getPatients().length, initialPatientListLength);
  });

  test("A new patient added has no entries", async() => {
    const patientData: PatientFormValues = {
      name: "Anonymous",
      ssn: "010101-01",
      dateOfBirth: "1980-01-01",
      gender: Gender.Other,
      occupation: "None"
    };

    // Creates a new patient on the server
    const postResponse = await api
      .post("/api/patients")
      .send(patientData)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const newPatient: Patient = postResponse.body as Patient;

    // Fetches the full info of the newly created patient from the server
    const findResponse = await api
      .get(`/api/patients/${newPatient.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const patientInfo = findResponse.body as Patient;

    // Checks if the entries field is empty
    assert.strictEqual("entries" in patientInfo, true);
    assert.strictEqual(patientInfo.entries.length, 0);

    // Checks if the total number of patients has changed
    assert.strictEqual(patientsService.getPatients().length, initialPatientListLength + 1);
  });
});
