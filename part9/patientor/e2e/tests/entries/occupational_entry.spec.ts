// Playwright dependencies
import { test, expect } from "@playwright/test";

// Helper functions
import { confirmPatientName } from "../helpers/patient_helpers";
import { addOccupationalEntry, assertOccupationalEntry } from "../helpers/entries/occupational_entry";

// Constants
const occupationalEntry = {
  description: "Patient with moderate respiratory issues.",
  date: {
    year: "2025",
    month: "12",
    day: "31"
  },
  specialist: "Doctor Tester",
  employerName: "Company",
  diagnosisCodes: [
    "J06.9"
  ],
  sickLeave: {
    startDate: {
      year: "2026",
      month: "01",
      day: "01"
    },
    endDate: {
      year: "2026",
      month: "01",
      day: "15"
    },
  }
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
test.describe("Valid Occupational entries", () => {
  test("should add a new Occupational Healthcare entry", async ({ page }) => {
    await confirmPatientName(page, "John Johns");
    await addOccupationalEntry(page, occupationalEntry);
    await expect(page.getByRole('alert')).toHaveText("Entry was added successfully!");

    const entries = page.locator(".patient-entry");
    await assertOccupationalEntry(entries.first(), occupationalEntry);
  });

  test("the diagnosis code field is optional", async ({ page }) => {
    await confirmPatientName(page, "John Johns");
    const { diagnosisCodes, ...otherFields } = occupationalEntry;
    await addOccupationalEntry(page, otherFields);
    await expect(page.getByRole('alert')).toHaveText("Entry was added successfully!");

    const entries = page.locator(".patient-entry");
    await assertOccupationalEntry(entries.first(), otherFields);
  });

  test("the sick leave field is optional", async ({ page }) => {
    await confirmPatientName(page, "John Johns");
    const { sickLeave, ...otherFields } = occupationalEntry;
    await addOccupationalEntry(page, otherFields);
    await expect(page.getByRole('alert')).toHaveText("Entry was added successfully!");

    const entries = page.locator(".patient-entry");
    await assertOccupationalEntry(entries.first(), otherFields);
  });
});