// Playwright dependencies
import { test } from "@playwright/test";

// Helper functions
import { setupTestPatient } from "../helpers/setup";
import { accessPatientEntries } from "../helpers/entries/entry_helpers";
import {
  addHospitalEntry,
  assertHospitalEntry,
  testMissingField,
} from "../helpers/entries/hospital_entry";

// Constants
import { newPatient, hospitalEntry } from "../helpers/constants";

// Posts a new patient with no entries
test.beforeEach(async ({ page, request }) => {
  await setupTestPatient(page, request);
});

// E2E tests
test.describe("Valid Hospital entries", () => {
  test("should add a new valid entry", async ({ page }) => {
    // Access a patient's info page and get the initial number of entries
    const initialEntriesLength = await accessPatientEntries(
      page,
      newPatient.name,
    );

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
    const initialEntriesLength = await accessPatientEntries(
      page,
      newPatient.name,
    );

    // Add a new entry without a diagnosis code
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
    const initialEntriesLength = await accessPatientEntries(
      page,
      newPatient.name,
    );

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
    // Access a patient's info page and get the initial number of entries
    const initialEntriesLength = await accessPatientEntries(
      page,
      newPatient.name,
    );

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
    const initialEntriesLength = await accessPatientEntries(
      page,
      newPatient.name,
    );

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
    const initialEntriesLength = await accessPatientEntries(
      page,
      newPatient.name,
    );

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

  test("missing both the discharge fields", async ({ page }) => {
    // Access a patient's info page and get the initial number of entries
    const initialEntriesLength = await accessPatientEntries(
      page,
      newPatient.name,
    );

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
    const initialEntriesLength = await accessPatientEntries(
      page,
      newPatient.name,
    );

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
    const initialEntriesLength = await accessPatientEntries(
      page,
      newPatient.name,
    );

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
