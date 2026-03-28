// Playwright dependencies
import { test, expect } from "@playwright/test";

// Helper functions
import { checkCommonEntryFields } from "./helpers/entries/entry_helpers";
import { confirmPatientName } from "./helpers/patient_helpers";
import { addHospitalEntry, assertHospitalEntry } from "./helpers/entries/hospital_entry";
import { addHealthCheckEntry, assertHealthCheckEntry } from "./helpers/entries/healthcheck_entry";
import { addOccupationalEntry, assertOccupationalEntry } from "./helpers/entries/occupational_entry";

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
test.describe("Adding new entries", () => {
  test("the add new entry button should display a form", async ({ page }) => {
    await page
      .locator('tbody')
      .getByRole('link', { name: 'John Johns' }).click();

    await expect(page.getByRole('heading', { level: 2 })).toHaveText("John Johns");

    await page.getByRole('button', { name: 'Add new entry' }).click();

    // Checks only the common fields between all entry types
    await checkCommonEntryFields(page);
  });

  test("the cancel button should hide the entry form", async ({ page }) => {
    await page
      .locator('tbody')
      .getByRole('link', { name: 'John Johns' }).click();

    await expect(page.getByRole('heading', { level: 2 })).toHaveText("John Johns");

    await page.getByRole('button', { name: 'Add new entry' }).click();

    // Confirms the form is displayed
    await expect(page.locator('label').filter({ hasText: 'Entry type' })).toBeVisible();

    // Confirms the Cancel button exists and can be clicked on
    const cancelButton = page.getByRole('button', { name: 'Cancel', exact: true });
    await expect(cancelButton).toBeVisible();
    await cancelButton.click();

    // Checks if the form is truly hidden
    await expect(page.getByRole('button', { name: 'Add new entry' })).toBeVisible();
    await expect(page.locator('label').filter({ hasText: 'Entry type' })).toBeHidden();
  });

  test("should display all fields for a new Hospital entry", async ({ page }) => {
    await confirmPatientName(page, "John Johns");
    await page.getByRole('button', { name: 'Add new entry' }).click();
    await page.getByRole('combobox', { name: 'Entry type' }).click();
    await page.getByRole('option', { name: "Hospital", exact: true }).click();

    await checkCommonEntryFields(page);
    await expect(page.locator('label').filter({ hasText: 'Discharge' })).toBeVisible();
    await expect(page.getByRole('group', { name: 'Date' }).nth(1)).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Criteria' })).toBeVisible();
  });

  test("should display all fields for a new HealthCheck entry", async ({ page }) => {
    await confirmPatientName(page, "John Johns");
    await page.getByRole('button', { name: 'Add new entry' }).click();
    await page.getByRole('combobox', { name: 'Entry type' }).click();
    await page.getByRole('option', { name: "HealthCheck", exact: true }).click();

    await checkCommonEntryFields(page);
    await expect(page.locator('label').filter({ hasText: 'Health Rating' })).toBeVisible();
    await expect(page.getByRole('combobox', { name: 'Health Rating' })).toBeVisible();
  });

  test("should display all fields for a new Occupational Healthcare entry", async ({ page }) => {
    await confirmPatientName(page, "John Johns");
    await page.getByRole('button', { name: 'Add new entry' }).click();
    await page.getByRole('combobox', { name: 'Entry type' }).click();
    await page.getByRole('option', { name: "OccupationalHealthcare", exact: true }).click();

    await checkCommonEntryFields(page);
    await expect(page.locator('label').filter({ hasText: 'Sick leave' })).toBeVisible();
    await expect(page.getByRole('group', { name: 'Start date', exact: true })).toBeVisible();
    await expect(page.getByRole('group', { name: 'End date', exact: true })).toBeVisible();
  });

  test("should add a new Hospital entry", async ({ page }) => {
    const hospitalEntry = {
      description: "Stable condition.",
      date: {
        year: "2025",
        month: "12",
        day: "31"
      },
      specialist: "Doctor Tester",
      diagnosisCodes: [
        "J10.1"
      ],
      discharge: {
        date: {
          year: "2026",
          month: "01",
          day: "03"
        },
        criteria: "Patient has healed.",
      }
    };

    await confirmPatientName(page, "John Johns");
    await addHospitalEntry(page, hospitalEntry);
    await expect(page.getByRole('alert')).toHaveText("Entry was added successfully!");

    const entries = page.locator(".patient-entry");
    await assertHospitalEntry(entries.first(), hospitalEntry);
  });

  test("should add a new HealthCheck entry", async ({ page }) => {
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

    await confirmPatientName(page, "John Johns");
    await addHealthCheckEntry(page, healthCheckEntry);
    await expect(page.getByRole('alert')).toHaveText("Entry was added successfully!");

    const entries = page.locator(".patient-entry");
    await assertHealthCheckEntry(entries.first(), healthCheckEntry);
  });

  test("should add a new Occupational Healthcare entry", async ({ page }) => {
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

    await confirmPatientName(page, "John Johns");
    await addOccupationalEntry(page, occupationalEntry);
    await expect(page.getByRole('alert')).toHaveText("Entry was added successfully!");

    const entries = page.locator(".patient-entry");
    await assertOccupationalEntry(entries.first(), occupationalEntry);
  });
});