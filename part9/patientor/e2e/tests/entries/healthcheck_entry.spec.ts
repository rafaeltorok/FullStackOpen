// Playwright dependencies
import { test, expect } from "@playwright/test";

// Helper functions
import { confirmPatientName } from "../helpers/patient_helpers";
import { addHealthCheckEntry, assertHealthCheckEntry } from "../helpers/entries/healthcheck_entry";

// Constants
const healthCheckEntry = {
  description: "Routine check.",
  date: {
    year: "2025",
    month: "12",
    day: "31"
  },
  specialist: "Doctor Tester",
  diagnosisCodes: [
    "N30.0"
  ],
  healthCheckRating: 0
};

// Posts a new patient with no entries
test.beforeEach(async ({ page, request }) => {
  // Resets the database to the original state before each test
  await page.request.post(`/api/testing/reset`);

  const postResponse = await request.post(`/api/patients`, {
    data: {
      name: 'John Johns',
      ssn: '090786-122X',
      dateOfBirth: '1980-01-01',
      occupation: 'Developer',
      gender: 'male'
    }
  });

  // ensure the request succeeded before proceeding
  expect(postResponse.ok()).toBeTruthy();

  await page.goto("/");
  await expect(page.getByText('John Johns')).toBeVisible();
});

// E2E tests
test.describe("Valid HealthCheck entries", () => {
  test("should add a new HealthCheck entry", async ({ page }) => {
    await confirmPatientName(page, "John Johns");
    await addHealthCheckEntry(page, healthCheckEntry);
    await expect(page.getByRole('alert')).toHaveText("Entry was added successfully!");

    const entries = page.locator(".patient-entry");
    await assertHealthCheckEntry(entries.first(), healthCheckEntry);
  });

  test("the diagnosis code field is optional", async ({ page }) => {
    await confirmPatientName(page, "John Johns");
    const { diagnosisCodes, ...otherFields } = healthCheckEntry;
    await addHealthCheckEntry(page, otherFields);
    await expect(page.getByRole('alert')).toHaveText("Entry was added successfully!");

    const entries = page.locator(".patient-entry");
    await assertHealthCheckEntry(entries.first(), otherFields);
  });
});
