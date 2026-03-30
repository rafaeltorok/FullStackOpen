// Playwright dependencies
import { test, expect } from "@playwright/test";

// Helper functions
import { accessPatientInfo } from "../helpers/patient_helpers";
import {
  addHealthCheckEntry,
  assertHealthCheckEntry,
  testMissingField,
} from "../helpers/entries/healthcheck_entry";

// Constants
const healthCheckEntry = {
  description: "Routine check.",
  date: {
    year: "2025",
    month: "12",
    day: "31",
  },
  specialist: "Doctor Tester",
  diagnosisCodes: ["N30.0"],
  healthCheckRating: 0,
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
test.describe("Valid HealthCheck entries", () => {
  test("should add a new HealthCheck entry", async ({ page }) => {
    // Access a patient's info page and get the initial number of entries
    await accessPatientInfo(page, newPatient.name);
    const initialEntriesLength = await page.locator(".patient-entry").count();

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
    await accessPatientInfo(page, newPatient.name);
    const initialEntriesLength = await page.locator(".patient-entry").count();

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
    await accessPatientInfo(page, newPatient.name);
    const initialEntriesLength = await page.locator(".patient-entry").count();

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
    await accessPatientInfo(page, newPatient.name);
    const initialEntriesLength = await page.locator(".patient-entry").count();

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
    await accessPatientInfo(page, newPatient.name);
    const initialEntriesLength = await page.locator(".patient-entry").count();

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
    await accessPatientInfo(page, newPatient.name);
    const initialEntriesLength = await page.locator(".patient-entry").count();

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
    await accessPatientInfo(page, newPatient.name);
    const initialEntriesLength = await page.locator(".patient-entry").count();

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

  test("LowRisk rating has a yellow color", async ({ page }) => {
    // Access a patient's info page and get the initial number of entries
    await accessPatientInfo(page, newPatient.name);
    const initialEntriesLength = await page.locator(".patient-entry").count();

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

  test("HighRisk rating has an orange color", async ({ page }) => {
    // Access a patient's info page and get the initial number of entries
    await accessPatientInfo(page, newPatient.name);
    const initialEntriesLength = await page.locator(".patient-entry").count();

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

  test("CriticalRisk rating has a red color", async ({ page }) => {
    // Access a patient's info page and get the initial number of entries
    await accessPatientInfo(page, newPatient.name);
    const initialEntriesLength = await page.locator(".patient-entry").count();

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
