// Playwright dependencies
import { test, expect } from "@playwright/test";

// Helper functions
import { confirmPatientName } from "../helpers/patient_helpers";
import {
  addHealthCheckEntry,
  assertHealthCheckEntry,
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

// Posts a new patient with no entries
test.beforeEach(async ({ page, request }) => {
  // Resets the database to the original state before each test
  await page.request.post(`/api/testing/reset`);

  const postResponse = await request.post(`/api/patients`, {
    data: {
      name: "John Johns",
      ssn: "090786-122X",
      dateOfBirth: "1980-01-01",
      occupation: "Developer",
      gender: "male",
    },
  });

  // ensure the request succeeded before proceeding
  expect(postResponse.ok()).toBeTruthy();

  await page.goto("/");
  await expect(page.getByText("John Johns")).toBeVisible();
});

// E2E tests
test.describe("Valid HealthCheck entries", () => {
  test("should add a new HealthCheck entry", async ({ page }) => {
    const initialEntriesLength = await page.locator(".patient-entry").count();
    await confirmPatientName(page, "John Johns");

    await addHealthCheckEntry(page, healthCheckEntry);
    await expect(page.getByRole("alert")).toHaveText(
      "Entry was added successfully!",
    );

    const entries = page.locator(".patient-entry");
    await assertHealthCheckEntry(entries.first(), healthCheckEntry);
    await expect(page.locator(".patient-entry")).toHaveCount(
      initialEntriesLength + 1,
    );
  });

  test("the diagnosis code field is optional", async ({ page }) => {
    const initialEntriesLength = await page.locator(".patient-entry").count();
    await confirmPatientName(page, "John Johns");

    const { diagnosisCodes, ...otherFields } = healthCheckEntry;
    await addHealthCheckEntry(page, otherFields);
    await expect(page.getByRole("alert")).toHaveText(
      "Entry was added successfully!",
    );

    const entries = page.locator(".patient-entry");
    await assertHealthCheckEntry(entries.first(), otherFields);
    await expect(page.locator(".patient-entry")).toHaveCount(
      initialEntriesLength + 1,
    );
  });

  test("multiple diagnosis codes can be added", async ({ page }) => {
    const initialEntriesLength = await page.locator(".patient-entry").count();
    await confirmPatientName(page, "John Johns");

    const codes = ["M24.2", "M51.2", "S03.5", "J10.1", "J06.9"];

    const { diagnosisCodes, ...otherFields } = healthCheckEntry;
    await addHealthCheckEntry(page, { ...otherFields, diagnosisCodes: codes });
    await expect(page.getByRole("alert")).toHaveText(
      "Entry was added successfully!",
    );

    const entries = page.locator(".patient-entry");
    await assertHealthCheckEntry(entries.first(), otherFields);
    await expect(page.locator(".patient-entry")).toHaveCount(
      initialEntriesLength + 1,
    );
  });
});

test.describe("Invalid HealthCheck entries", () => {
  test("missing the description field", async ({ page }) => {
    const initialEntriesLength = await page.locator(".patient-entry").count();
    await confirmPatientName(page, "John Johns");

    const { description, ...otherFields } = healthCheckEntry;
    await addHealthCheckEntry(page, otherFields);
    await expect(page.getByRole("alert")).toHaveText(
      "Missing required field(s): Description, Date or Specialist",
    );
    await expect(page.locator(".patient-entry")).toHaveCount(
      initialEntriesLength,
    );
  });

  test("missing the date field", async ({ page }) => {
    const initialEntriesLength = await page.locator(".patient-entry").count();
    await confirmPatientName(page, "John Johns");

    const { date, ...otherFields } = healthCheckEntry;
    await addHealthCheckEntry(page, otherFields);
    await expect(page.getByRole("alert")).toHaveText(
      "Missing required field(s): Description, Date or Specialist",
    );
    await expect(page.locator(".patient-entry")).toHaveCount(
      initialEntriesLength,
    );
  });

  test("missing the specialist field", async ({ page }) => {
    const initialEntriesLength = await page.locator(".patient-entry").count();
    await confirmPatientName(page, "John Johns");

    const { specialist, ...otherFields } = healthCheckEntry;
    await addHealthCheckEntry(page, otherFields);
    await expect(page.getByRole("alert")).toHaveText(
      "Missing required field(s): Description, Date or Specialist",
    );
    await expect(page.locator(".patient-entry")).toHaveCount(
      initialEntriesLength,
    );
  });
});

test.describe("Testing the Health Rating field", () => {
  test("the 'Healthy' health rating is the default one", async ({ page }) => {
    const initialEntriesLength = await page.locator(".patient-entry").count();
    await confirmPatientName(page, "John Johns");

    const { healthCheckRating, ...otherFields } = healthCheckEntry;
    await addHealthCheckEntry(page, otherFields);
    await expect(page.getByRole("alert")).toHaveText(
      "Entry was added successfully!",
    );

    const entries = page.locator(".patient-entry");
    await assertHealthCheckEntry(entries.first(), healthCheckEntry);
    await expect(page.getByTestId("FavoriteIcon")).toHaveCSS(
      "color",
      "rgb(0, 255, 0)",
    );
    await expect(page.locator(".patient-entry")).toHaveCount(
      initialEntriesLength + 1,
    );
  });

  test("LowRisk rating has a yellow color", async ({ page }) => {
    await confirmPatientName(page, "John Johns");

    await addHealthCheckEntry(page, {
      ...healthCheckEntry,
      healthCheckRating: 1,
    });
    await expect(page.getByRole("alert")).toHaveText(
      "Entry was added successfully!",
    );

    const entries = page.locator(".patient-entry");
    await assertHealthCheckEntry(entries.first(), {
      ...healthCheckEntry,
      healthCheckRating: 1,
    });
    await expect(page.getByTestId("FavoriteIcon")).toHaveCSS(
      "color",
      "rgb(255, 255, 0)",
    );
  });

  test("HighRisk rating has an orange color", async ({ page }) => {
    await confirmPatientName(page, "John Johns");

    await addHealthCheckEntry(page, {
      ...healthCheckEntry,
      healthCheckRating: 2,
    });
    await expect(page.getByRole("alert")).toHaveText(
      "Entry was added successfully!",
    );

    const entries = page.locator(".patient-entry");
    await assertHealthCheckEntry(entries.first(), {
      ...healthCheckEntry,
      healthCheckRating: 2,
    });
    await expect(page.getByTestId("FavoriteIcon")).toHaveCSS(
      "color",
      "rgb(255, 125, 0)",
    );
  });

  test("CriticalRisk rating has a red color", async ({ page }) => {
    await confirmPatientName(page, "John Johns");

    await addHealthCheckEntry(page, {
      ...healthCheckEntry,
      healthCheckRating: 3,
    });
    await expect(page.getByRole("alert")).toHaveText(
      "Entry was added successfully!",
    );

    const entries = page.locator(".patient-entry");
    await assertHealthCheckEntry(entries.first(), {
      ...healthCheckEntry,
      healthCheckRating: 3,
    });
    await expect(page.getByTestId("FavoriteIcon")).toHaveCSS(
      "color",
      "rgb(255, 0, 0)",
    );
  });
});
