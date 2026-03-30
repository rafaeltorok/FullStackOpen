// Playwright dependencies
import { test, expect } from "@playwright/test";

// Helper functions
import { accessPatientInfo } from "../helpers/patient_helpers";
import {
  addOccupationalEntry,
  assertOccupationalEntry,
  testMissingField,
} from "../helpers/entries/occupational_entry";

// Constants
const occupationalEntry = {
  description: "Patient with moderate respiratory issues.",
  date: {
    year: "2025",
    month: "12",
    day: "31",
  },
  specialist: "Doctor Tester",
  employerName: "Company",
  diagnosisCodes: ["J06.9"],
  sickLeave: {
    startDate: {
      year: "2026",
      month: "01",
      day: "01",
    },
    endDate: {
      year: "2026",
      month: "01",
      day: "15",
    },
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
test.describe("Valid Occupational Healthcare entries", () => {
  test("should add a new Occupational Healthcare entry", async ({ page }) => {
    // Access a patient's info page and get the initial number of entries
    await accessPatientInfo(page, newPatient.name);
    const initialEntriesLength = await page.locator(".patient-entry").count();

    // Add a new entry
    await addOccupationalEntry(page, occupationalEntry, initialEntriesLength);

    // Confirm the new entry has been added correctly
    const entry = page
      .locator(".patient-entry")
      .filter({ hasText: occupationalEntry.description });
    await assertOccupationalEntry(entry, occupationalEntry);
  });

  test("the diagnosis code field is optional", async ({ page }) => {
    // Access a patient's info page and get the initial number of entries
    await accessPatientInfo(page, newPatient.name);
    const initialEntriesLength = await page.locator(".patient-entry").count();

    const { diagnosisCodes, ...otherFields } = occupationalEntry;
    await addOccupationalEntry(page, otherFields, initialEntriesLength);

    // Confirm the new entry has been added correctly
    const entry = page
      .locator(".patient-entry")
      .filter({ hasText: occupationalEntry.description });
    await assertOccupationalEntry(entry, otherFields);
  });

  test("multiple diagnosis codes can be added", async ({ page }) => {
    // Access a patient's info page and get the initial number of entries
    await accessPatientInfo(page, newPatient.name);
    const initialEntriesLength = await page.locator(".patient-entry").count();

    const codes = ["M24.2", "M51.2", "S03.5", "J10.1", "J06.9"];

    // Add the new entry with the multiple diagnosis codes
    const { diagnosisCodes, ...otherFields } = occupationalEntry;
    await addOccupationalEntry(
      page,
      { ...otherFields, diagnosisCodes: codes },
      initialEntriesLength,
    );

    // Confirm the new entry has been added correctly
    const entry = page
      .locator(".patient-entry")
      .filter({ hasText: occupationalEntry.description });
    await assertOccupationalEntry(entry, {
      ...otherFields,
      diagnosisCodes: codes,
    });
  });

  test("the sick leave field is optional", async ({ page }) => {
    // Access a patient's info page and get the initial number of entries
    await accessPatientInfo(page, newPatient.name);
    const initialEntriesLength = await page.locator(".patient-entry").count();

    const { sickLeave, ...otherFields } = occupationalEntry;
    await addOccupationalEntry(page, otherFields, initialEntriesLength);

    const entry = page
      .locator(".patient-entry")
      .filter({ hasText: occupationalEntry.description });
    await assertOccupationalEntry(entry, otherFields);
  });
});

test.describe("Invalid Occupational Healthcare entries", () => {
  test("missing the description field", async ({ page }) => {
    await accessPatientInfo(page, newPatient.name);
    const initialEntriesLength = await page.locator(".patient-entry").count();

    const errorMessage =
      "Missing required field(s): Description, Date or Specialist";

    // Remove the field and try to add a new entry
    const { description, ...otherFields } = occupationalEntry;
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
    const { date, ...otherFields } = occupationalEntry;
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
    const { specialist, ...otherFields } = occupationalEntry;
    await testMissingField(
      page,
      otherFields,
      errorMessage,
      initialEntriesLength,
    );
  });

  // The sick leave field might be optional, but if one of its fields are filled, the other must be filled too
  test("missing the start date of the sick leave field", async ({ page }) => {
    // Access a patient's info page and get the initial number of entries
    await accessPatientInfo(page, newPatient.name);
    const initialEntriesLength = await page.locator(".patient-entry").count();

    const errorMessage = "Missing one of the sick leave dates";

    const {
      sickLeave: { startDate: sickLeaveDate, ...otherDate },
      ...otherFields
    } = occupationalEntry;
    await testMissingField(
      page,
      { ...otherFields, sickLeave: otherDate },
      errorMessage,
      initialEntriesLength,
    );
  });

  test("missing the end date of the sick leave field", async ({ page }) => {
    // Access a patient's info page and get the initial number of entries
    await accessPatientInfo(page, newPatient.name);
    const initialEntriesLength = await page.locator(".patient-entry").count();

    const errorMessage = "Missing one of the sick leave dates";

    const {
      sickLeave: { endDate: sickLeaveDate, ...otherDate },
      ...otherFields
    } = occupationalEntry;
    await testMissingField(
      page,
      { ...otherFields, sickLeave: otherDate },
      errorMessage,
      initialEntriesLength,
    );
  });
});
