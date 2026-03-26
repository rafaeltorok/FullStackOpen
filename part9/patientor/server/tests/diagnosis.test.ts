/* eslint-disable @typescript-eslint/no-floating-promises */

// Node testing library dependencies
import { test, beforeEach, describe } from "node:test";
import assert from "node:assert";
import supertest from "supertest";

// Importing the server Express app
import getApp from "../src/app";

// Services
import diagnosesService from "../src/services/diagnosesService";

// TypeScript types
import type { Diagnosis } from "../../shared/types";

// app + api setup
const app = getApp();
const api = supertest(app);

// Stores the initial number of diagnoses
const initialDiagnosesListLength: number =
  diagnosesService.getDiagnoses().length;

// Tests
// Resets the database
beforeEach(async () => {
  await api.post("/api/testing/reset");
});

describe("Testing the Express server", () => {
  test("The HTTP server works", async () => {
    await api
      .get("/api/ping")
      .expect("Content-Type", /text\/html/)
      .expect(200, "pong");
  });
});

describe("GET route", () => {
  test("Data is returned as JSON", async () => {
    await api
      .get("/api/diagnoses")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("All diagnoses are returned", async () => {
    const response = await api.get("/api/diagnoses");
    const diagnosesList = response.body as Diagnosis[];
    assert.strictEqual(diagnosesList.length, initialDiagnosesListLength);
  });

  test("An individual diagnosis is correctly returned", async () => {
    // Get the list with all available diagnoses
    const getAllResponse = await api
      .get("/api/diagnoses")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const diagnosesList = getAllResponse.body as Diagnosis[];

    // Get an specific diagnose by its code
    const findResponse = await api
      .get(`/api/diagnoses/${diagnosesList[0].code}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const diagnosisInfo = findResponse.body as Diagnosis;

    assert.deepStrictEqual(diagnosesList[0], diagnosisInfo);

    // Checks if required fields are present on the diagnosis info
    assert.strictEqual("code" in diagnosisInfo, true);
    assert.strictEqual("name" in diagnosisInfo, true);
  });

  test("A non-existing code returns a proper error response", async () => {
    // Get an specific diagnosis by its code
    const response = await api
      .get(`/api/diagnoses/A00.0`)
      .expect(404)
      .expect("Content-Type", /application\/json/);

    assert.deepStrictEqual(response.body, { error: "Diagnosis not found" });
  });
});

describe("POST route", () => {
  test("A new diagnose can be added", async () => {
    const diagnosisData: Diagnosis = {
      code: "R51.9",
      name: "Unspecified Headache",
      latin: "Latin name",
    };

    // Creates a new diagnosis on the server
    const postResponse = await api
      .post("/api/diagnoses")
      .send(diagnosisData)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const newDiagnosis = postResponse.body as Diagnosis;

    // Checks if the created diagnosis info is the same as the one sent
    assert.strictEqual(newDiagnosis.code, diagnosisData.code);
    assert.strictEqual(newDiagnosis.name, diagnosisData.name);
    assert.strictEqual(newDiagnosis.latin, diagnosisData.latin);

    // Checks if the total number of diagnoses has changed
    assert.strictEqual(
      diagnosesService.getDiagnoses().length,
      initialDiagnosesListLength + 1,
    );
  });

  test("The latin field is optional", async () => {
    const diagnosisData: Diagnosis = {
      code: "R51.9",
      name: "Unspecified Headache",
    };

    // Creates a new diagnosis on the server
    const postResponse = await api
      .post("/api/diagnoses")
      .send(diagnosisData)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const newDiagnosis = postResponse.body as Diagnosis;

    // Checks if the created diagnosis info is the same as the one sent
    assert.strictEqual(newDiagnosis.code, diagnosisData.code);
    assert.strictEqual(newDiagnosis.name, diagnosisData.name);
    assert.strictEqual("latin" in newDiagnosis, false);

    // Checks if the total number of diagnoses has changed
    assert.strictEqual(
      diagnosesService.getDiagnoses().length,
      initialDiagnosesListLength + 1,
    );
  });

  test("Empty required fields", async () => {
    const diagnosisData = {
      code: "",
      name: "",
    };

    // Creates a new diagnosis on the server
    await api
      .post("/api/diagnoses")
      .send(diagnosisData)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    // Checks if the total number of diagnoses has changed
    assert.strictEqual(
      diagnosesService.getDiagnoses().length,
      initialDiagnosesListLength,
    );
  });

  test("Sending an empty request body", async () => {
    const diagnosisData = {};

    // Creates a new diagnosis on the server
    await api
      .post("/api/diagnoses")
      .send(diagnosisData)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    // Checks if the total number of diagnoses has changed
    assert.strictEqual(
      diagnosesService.getDiagnoses().length,
      initialDiagnosesListLength,
    );
  });

  test("Missing required fields", async () => {
    const noCode = {
      name: "Unspecified Headaches",
    };

    await api
      .post("/api/diagnoses")
      .send(noCode)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    // Checks if the total number of diagnoses has changed
    assert.strictEqual(
      diagnosesService.getDiagnoses().length,
      initialDiagnosesListLength,
    );

    const noName = {
      code: "R51.9",
    };

    await api
      .post("/api/diagnoses")
      .send(noName)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(
      diagnosesService.getDiagnoses().length,
      initialDiagnosesListLength,
    );
  });
});
