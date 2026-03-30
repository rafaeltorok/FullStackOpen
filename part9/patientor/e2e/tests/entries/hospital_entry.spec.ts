// Playwright dependencies
import { test, expect } from "@playwright/test";

// Helper functions
import { accessPatientInfo } from "../helpers/patient_helpers";
import {
  addHospitalEntry,
  assertHospitalEntry,
  testMissingField,
} from "../helpers/entries/hospital_entry";

// Constants
const hospitalEntry = {
  description: "Stable condition.",
  date: {
    year: "2025",
    month: "12",
    day: "31",
  },
  specialist: "Doctor Tester",
  diagnosisCodes: ["J10.1"],
  discharge: {
    date: {
      year: "2026",
      month: "01",
      day: "03",
    },
    criteria: "Patient has healed.",
  },
};

const newPatient = {
  name: "John Johns",
  ssn: "090786-122X",
  dateOfBirth: "1980-01-01",
  occupation: "Developer",
  gender: "male",
};

// Posts a new patient with no entries
test.beforeEach(async ({ page, request }) => {
  // Resets the database to the original state before each test
  await page.request.post(`/api/testing/reset`);

  // Add a new patient through the backend server
  const postResponse = await request.post(`/api/patients`, {
    data: { ...newPatient },
  });

  // ensure the request succeeded before proceeding
  expect(postResponse.ok()).toBeTruthy();

  // Navigate to the main page and assert the new patient is present
  await page.goto("/");
  await expect(page.getByText(newPatient.name)).toBeVisible();
});

// E2E tests
test.describe("Valid Hospital entries", () => {
  test("should add a new valid entry", async ({ page }) => {
    // Access a patient's info page and get the initial number of entries
    await accessPatientInfo(page, newPatient.name);
    const initialEntriesLength = await page.locator(".patient-entry").count();

    // Add a new entry
    await addHospitalEntry(page, hospitalEntry, initialEntriesLength);

    // Confirm the new entry has been added correctly
    const entry = page
      .locator(".patient-entry")
      .filter({ hasText: hospitalEntry.description });
    await assertHospitalEntry(entry, hospitalEntry);
  });

  test("the diagnosis code field is optional", async ({ page }) => {
    // Access a patient's info page and get the initial number of entries
    await accessPatientInfo(page, newPatient.name);
    const initialEntriesLength = await page.locator(".patient-entry").count();

    const { diagnosisCodes, ...otherFields } = hospitalEntry;
    await addHospitalEntry(page, otherFields, initialEntriesLength);

    // Confirm the new entry has been added correctly
    const entry = page
      .locator(".patient-entry")
      .filter({ hasText: hospitalEntry.description });
    await assertHospitalEntry(entry, otherFields);
  });

  test("multiple diagnosis codes can be added", async ({ page }) => {
    // Access a patient's info page and get the initial number of entries
    await accessPatientInfo(page, newPatient.name);
    const initialEntriesLength = await page.locator(".patient-entry").count();

    const codes = ["M24.2", "M51.2", "S03.5", "J10.1", "J06.9"];

    // Add the new entry with the multiple diagnosis codes
    const { diagnosisCodes, ...otherFields } = hospitalEntry;
    await addHospitalEntry(
      page,
      { ...otherFields, diagnosisCodes: codes },
      initialEntriesLength,
    );

    // Confirm the new entry has been added correctly
    const entry = page
      .locator(".patient-entry")
      .filter({ hasText: hospitalEntry.description });
    await assertHospitalEntry(entry, { ...otherFields, diagnosisCodes: codes });
  });
});

test.describe("Invalid Hospital entries", () => {
  test("missing the description field", async ({ page }) => {
    await accessPatientInfo(page, newPatient.name);
    const initialEntriesLength = await page.locator(".patient-entry").count();

    const errorMessage =
      "Missing required field(s): Description, Date or Specialist";

    // Remove the field and try to add a new entry
    const { description, ...otherFields } = hospitalEntry;
    await testMissingField(
      page,
      otherFields,
      errorMessage,
      initialEntriesLength,
    );
  });

  test("missing the date field", async ({ page }) => {
    // Access a patient's info page and get the initial number of entries
    await accessPatientInfo(page, newPatient.name);
    const initialEntriesLength = await page.locator(".patient-entry").count();

    const errorMessage =
      "Missing required field(s): Description, Date or Specialist";

    // Remove the field and try to add a new entry
    const { date, ...otherFields } = hospitalEntry;
    await testMissingField(
      page,
      otherFields,
      errorMessage,
      initialEntriesLength,
    );
  });

  test("missing the specialist field", async ({ page }) => {
    // Access a patient's info page and get the initial number of entries
    await accessPatientInfo(page, newPatient.name);
    const initialEntriesLength = await page.locator(".patient-entry").count();

    const errorMessage =
      "Missing required field(s): Description, Date or Specialist";

    // Remove the field and try to add a new entry
    const { specialist, ...otherFields } = hospitalEntry;
    await testMissingField(
      page,
      otherFields,
      errorMessage,
      initialEntriesLength,
    );
  });

  test("missing both of the discharge fields", async ({ page }) => {
    // Access a patient's info page and get the initial number of entries
    await accessPatientInfo(page, newPatient.name);
    const initialEntriesLength = await page.locator(".patient-entry").count();

    const errorMessage = "The discharge field is required";

    // Remove the field and try to add a new entry
    const { discharge, ...otherFields } = hospitalEntry;
    await testMissingField(
      page,
      otherFields,
      errorMessage,
      initialEntriesLength,
    );
  });

  test("missing the date of the discharge field", async ({ page }) => {
    // Access a patient's info page and get the initial number of entries
    await accessPatientInfo(page, newPatient.name);
    const initialEntriesLength = await page.locator(".patient-entry").count();

    const errorMessage = "Missing one of the discharge fields";

    // Remove the field and try to add a new entry
    const {
      discharge: { date: dischargeDate, ...otherDischarge },
      ...otherFields
    } = hospitalEntry;
    await testMissingField(
      page,
      { ...otherFields, discharge: otherDischarge },
      errorMessage,
      initialEntriesLength,
    );
  });

  test("missing the criteria of the discharge field", async ({ page }) => {
    // Access a patient's info page and get the initial number of entries
    await accessPatientInfo(page, newPatient.name);
    const initialEntriesLength = await page.locator(".patient-entry").count();

    const errorMessage = "Missing one of the discharge fields";

    // Remove the field and try to add a new entry
    const {
      discharge: { criteria: dischargeCriteria, ...otherDischarge },
      ...otherFields
    } = hospitalEntry;
    await testMissingField(
      page,
      { ...otherFields, discharge: otherDischarge },
      errorMessage,
      initialEntriesLength,
    );
  });
});
