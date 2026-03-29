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
test.describe("Valid Occupational Healthcare entries", () => {
  test("should add a new Occupational Healthcare entry", async ({ page }) => {
    const initialEntriesLength = await page.locator(".patient-entry").count();
    await confirmPatientName(page, "John Johns");

    await addOccupationalEntry(page, occupationalEntry);
    await expect(page.getByRole('alert')).toHaveText("Entry was added successfully!");

    const entries = page.locator(".patient-entry");
    await assertOccupationalEntry(entries.first(), occupationalEntry);
    await expect(page.locator(".patient-entry")).toHaveCount(initialEntriesLength + 1);
  });

  test("the diagnosis code field is optional", async ({ page }) => {
    const initialEntriesLength = await page.locator(".patient-entry").count();
    await confirmPatientName(page, "John Johns");

    const { diagnosisCodes, ...otherFields } = occupationalEntry;
    await addOccupationalEntry(page, otherFields);
    await expect(page.getByRole('alert')).toHaveText("Entry was added successfully!");

    const entries = page.locator(".patient-entry");
    await assertOccupationalEntry(entries.first(), otherFields);
    await expect(page.locator(".patient-entry")).toHaveCount(initialEntriesLength + 1);
  });

  test("the sick leave field is optional", async ({ page }) => {
    const initialEntriesLength = await page.locator(".patient-entry").count();
    await confirmPatientName(page, "John Johns");

    const { sickLeave, ...otherFields } = occupationalEntry;
    await addOccupationalEntry(page, otherFields);
    await expect(page.getByRole('alert')).toHaveText("Entry was added successfully!");

    const entries = page.locator(".patient-entry");
    await assertOccupationalEntry(entries.first(), otherFields);
    await expect(page.locator(".patient-entry")).toHaveCount(initialEntriesLength + 1);
  });

  test("multiple diagnosis codes can be added", async({ page }) => {
    const initialEntriesLength = await page.locator(".patient-entry").count();
    await confirmPatientName(page, "John Johns");

    const codes = ["M24.2", "M51.2", "S03.5", "J10.1", "J06.9"];
    
    const { diagnosisCodes, ...otherFields } = occupationalEntry;
    await addOccupationalEntry(page, { ...otherFields, diagnosisCodes: codes });
    await expect(page.getByRole('alert')).toHaveText("Entry was added successfully!");

    const entries = page.locator(".patient-entry");
    await assertOccupationalEntry(entries.first(), otherFields);
    await expect(page.locator(".patient-entry")).toHaveCount(initialEntriesLength + 1);
  });
});

test.describe("Invalid Occupational Healthcare entries", () => {
  test("missing the description field", async ({ page }) => {
    const initialEntriesLength = await page.locator(".patient-entry").count();
    await confirmPatientName(page, "John Johns");

    const { description, ...otherFields } = occupationalEntry;
    await addOccupationalEntry(page, otherFields);
    await expect(page.getByRole('alert')).toHaveText("Missing required field(s): Description, Date or Specialist");
    await expect(page.locator(".patient-entry")).toHaveCount(initialEntriesLength);
  });

  test("missing the date field", async ({ page }) => {
    const initialEntriesLength = await page.locator(".patient-entry").count();
    await confirmPatientName(page, "John Johns");

    const { date, ...otherFields } = occupationalEntry;
    await addOccupationalEntry(page, otherFields);
    await expect(page.getByRole('alert')).toHaveText("Missing required field(s): Description, Date or Specialist");
    await expect(page.locator(".patient-entry")).toHaveCount(initialEntriesLength);
  });

  test("missing the specialist field", async ({ page }) => {
    const initialEntriesLength = await page.locator(".patient-entry").count();
    await confirmPatientName(page, "John Johns");

    const { specialist, ...otherFields } = occupationalEntry;
    await addOccupationalEntry(page, otherFields);
    await expect(page.getByRole('alert')).toHaveText("Missing required field(s): Description, Date or Specialist");
    await expect(page.locator(".patient-entry")).toHaveCount(initialEntriesLength);
  });

  // The sick leave field might be optional, but if one of its fields are filled, the other must be filled too
  test("missing the start date of the sick leave field", async ({ page }) => {
    const initialEntriesLength = await page.locator(".patient-entry").count();
    await confirmPatientName(page, "John Johns");

    const {
      sickLeave: { startDate: sickLeaveDate, ...otherDate },
      ...otherFields
    } = occupationalEntry;
    await addOccupationalEntry(page, { ...otherFields, sickLeave: otherDate });
    await expect(page.getByRole('alert')).toHaveText("Missing one of the sick leave dates");
    await expect(page.locator(".patient-entry")).toHaveCount(initialEntriesLength);
  });

  test("missing the end date of the sick leave field", async ({ page }) => {
    const initialEntriesLength = await page.locator(".patient-entry").count();
    await confirmPatientName(page, "John Johns");

    const {
      sickLeave: { endDate: sickLeaveDate, ...otherDate },
      ...otherFields
    } = occupationalEntry;
    await addOccupationalEntry(page, { ...otherFields, sickLeave: otherDate });
    await expect(page.getByRole('alert')).toHaveText("Missing one of the sick leave dates");
    await expect(page.locator(".patient-entry")).toHaveCount(initialEntriesLength);
  });
});