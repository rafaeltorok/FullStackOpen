// Playwright dependencies
import { test, expect } from "@playwright/test";

// Helper functions
import { setupTestPatient } from "../helpers/setup";
import { accessPatientEntries } from "../helpers/entries/entry_helpers";
import {
  addHealthCheckEntry,
  assertHealthCheckEntry,
  testMissingField,
} from "../helpers/entries/healthcheck_entry";

// Constants
import { newPatient, healthCheckEntry } from "../helpers/constants";

// Posts a new patient with no entries
test.beforeEach(async ({ page, request }) => {
  await setupTestPatient(page, request);
});

// E2E tests
test.describe("Valid HealthCheck entries", () => {
  test("should add a new HealthCheck entry", async ({ page }) => {
    // Access a patient's info page and get the initial number of entries
    const initialEntriesLength = await accessPatientEntries(
      page,
      newPatient.name,
    );

    // Add a new entry
    await addHealthCheckEntry(page, healthCheckEntry, initialEntriesLength);

    // Confirm the new entry has been added correctly
    const entry = page
      .locator(".patient-entry")
      .filter({ hasText: healthCheckEntry.description });
    await assertHealthCheckEntry(entry, healthCheckEntry);
  });

  test("the diagnosis code field is optional", async ({ page }) => {
    // Access a patient's info page and get the initial number of entries
    const initialEntriesLength = await accessPatientEntries(
      page,
      newPatient.name,
    );

    // Add a new entry without a diagnosis code
    const { diagnosisCodes, ...otherFields } = healthCheckEntry;
    await addHealthCheckEntry(page, otherFields, initialEntriesLength);

    // Confirm the new entry has been added correctly
    const entry = page
      .locator(".patient-entry")
      .filter({ hasText: healthCheckEntry.description });
    await assertHealthCheckEntry(entry, otherFields);
  });

  test("multiple diagnosis codes can be added", async ({ page }) => {
    // Access a patient's info page and get the initial number of entries
    const initialEntriesLength = await accessPatientEntries(
      page,
      newPatient.name,
    );

    const codes = ["M24.2", "M51.2", "S03.5", "J10.1", "J06.9"];

    // Add the new entry with the multiple diagnosis codes
    const { diagnosisCodes, ...otherFields } = healthCheckEntry;
    await addHealthCheckEntry(
      page,
      { ...otherFields, diagnosisCodes: codes },
      initialEntriesLength,
    );

    // Confirm the new entry has been added correctly
    const entry = page
      .locator(".patient-entry")
      .filter({ hasText: healthCheckEntry.description });
    await assertHealthCheckEntry(entry, {
      ...otherFields,
      diagnosisCodes: codes,
    });
  });
});

test.describe("Invalid HealthCheck entries", () => {
  test("missing the description field", async ({ page }) => {
    // Access a patient's info page and get the initial number of entries
    const initialEntriesLength = await accessPatientEntries(
      page,
      newPatient.name,
    );

    const errorMessage =
      "Missing required field(s): Description, Date or Specialist";

    // Remove the field and try to add a new entry
    const { description, ...otherFields } = healthCheckEntry;
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
    const { date, ...otherFields } = healthCheckEntry;
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
    const { specialist, ...otherFields } = healthCheckEntry;
    await testMissingField(
      page,
      otherFields,
      errorMessage,
      initialEntriesLength,
    );
  });
});

test.describe("Testing the Health Rating field", () => {
  test("the 'Healthy' health rating is the default one", async ({ page }) => {
    // Access a patient's info page and get the initial number of entries
    const initialEntriesLength = await accessPatientEntries(
      page,
      newPatient.name,
    );

    // Add a new entry
    const { healthCheckRating, ...otherFields } = healthCheckEntry;
    await addHealthCheckEntry(page, otherFields, initialEntriesLength);

    // Confirm the new entry has been added correctly
    const entry = page
      .locator(".patient-entry")
      .filter({ hasText: healthCheckEntry.description });
    await assertHealthCheckEntry(entry, healthCheckEntry);

    // Check the health rating color
    await expect(page.getByTestId("FavoriteIcon")).toHaveCSS(
      "color",
      "rgb(0, 255, 0)",
    );
  });

  test("LowRisk rating has the correct color", async ({ page }) => {
    // Access a patient's info page and get the initial number of entries
    const initialEntriesLength = await accessPatientEntries(
      page,
      newPatient.name,
    );

    // Add a new entry
    await addHealthCheckEntry(
      page,
      {
        ...healthCheckEntry,
        healthCheckRating: 1,
      },
      initialEntriesLength,
    );

    // Confirm the new entry has been added correctly
    const entry = page
      .locator(".patient-entry")
      .filter({ hasText: healthCheckEntry.description });
    await assertHealthCheckEntry(entry, {
      ...healthCheckEntry,
      healthCheckRating: 1,
    });

    // Check the health rating color
    await expect(page.getByTestId("FavoriteIcon")).toHaveCSS(
      "color",
      "rgb(255, 255, 0)",
    );
  });

  test("HighRisk rating has the correct color", async ({ page }) => {
    // Access a patient's info page and get the initial number of entries
    const initialEntriesLength = await accessPatientEntries(
      page,
      newPatient.name,
    );

    // Add a new entry
    await addHealthCheckEntry(
      page,
      {
        ...healthCheckEntry,
        healthCheckRating: 2,
      },
      initialEntriesLength,
    );

    // Confirm the new entry has been added correctly
    const entry = page
      .locator(".patient-entry")
      .filter({ hasText: healthCheckEntry.description });
    await assertHealthCheckEntry(entry, {
      ...healthCheckEntry,
      healthCheckRating: 2,
    });

    // Check the health rating color
    await expect(page.getByTestId("FavoriteIcon")).toHaveCSS(
      "color",
      "rgb(255, 125, 0)",
    );
  });

  test("CriticalRisk rating has the correct color", async ({ page }) => {
    // Access a patient's info page and get the initial number of entries
    const initialEntriesLength = await accessPatientEntries(
      page,
      newPatient.name,
    );

    // Add a new entry
    await addHealthCheckEntry(
      page,
      {
        ...healthCheckEntry,
        healthCheckRating: 3,
      },
      initialEntriesLength,
    );

    // Confirm the new entry has been added correctly
    const entry = page
      .locator(".patient-entry")
      .filter({ hasText: healthCheckEntry.description });
    await assertHealthCheckEntry(entry, {
      ...healthCheckEntry,
      healthCheckRating: 3,
    });

    // Check the health rating color
    await expect(page.getByTestId("FavoriteIcon")).toHaveCSS(
      "color",
      "rgb(255, 0, 0)",
    );
  });
});
