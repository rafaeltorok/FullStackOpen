// Playwright dependencies
import { test } from "@playwright/test";

// Helper functions
import { setupTestPatient } from "../helpers/setup";
import { accessPatientEntries } from "../helpers/entries/entry_helpers";
import {
  addOccupationalEntry,
  assertOccupationalEntry,
  testMissingField,
} from "../helpers/entries/occupational_entry";

// Constants
import { newPatient, occupationalEntry } from "../helpers/constants";

// Posts a new patient with no entries
test.beforeEach(async ({ page, request }) => {
  await setupTestPatient(page, request);
});

// E2E tests
test.describe("Valid Occupational Healthcare entries", () => {
  test("should add a new Occupational Healthcare entry", async ({ page }) => {
    // Access a patient's info page and get the initial number of entries
    const initialEntriesLength = await accessPatientEntries(
      page,
      newPatient.name,
    );

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
    const initialEntriesLength = await accessPatientEntries(
      page,
      newPatient.name,
    );

    // Add a new entry without a diagnosis code
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
    const initialEntriesLength = await accessPatientEntries(
      page,
      newPatient.name,
    );

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
    const initialEntriesLength = await accessPatientEntries(
      page,
      newPatient.name,
    );

    // Remove the field and try to add a new entry
    const { sickLeave, ...otherFields } = occupationalEntry;
    await addOccupationalEntry(page, otherFields, initialEntriesLength);

    // Confirm the new entry has been added correctly
    const entry = page
      .locator(".patient-entry")
      .filter({ hasText: occupationalEntry.description });
    await assertOccupationalEntry(entry, otherFields);
  });
});

test.describe("Invalid Occupational Healthcare entries", () => {
  test("missing the description field", async ({ page }) => {
    // Access a patient's info page and get the initial number of entries
    const initialEntriesLength = await accessPatientEntries(
      page,
      newPatient.name,
    );

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
    const initialEntriesLength = await accessPatientEntries(
      page,
      newPatient.name,
    );

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
    const initialEntriesLength = await accessPatientEntries(
      page,
      newPatient.name,
    );

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

  // The sick leave field might be optional, but if one of its fields are filled,
  // the other must be filled too
  test("missing the start date of the sick leave field", async ({ page }) => {
    // Access a patient's info page and get the initial number of entries
    const initialEntriesLength = await accessPatientEntries(
      page,
      newPatient.name,
    );

    const errorMessage = "Missing one of the sick leave dates";

    // Remove the field and try to add a new entry
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
    const initialEntriesLength = await accessPatientEntries(
      page,
      newPatient.name,
    );

    const errorMessage = "Missing one of the sick leave dates";

    // Remove the field and try to add a new entry
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
