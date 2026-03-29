// Playwright dependencies
import { test, expect } from "@playwright/test";

// Helper functions
import { confirmPatientName } from "../helpers/patient_helpers";
import {
  addHospitalEntry,
  assertHospitalEntry,
} from "../helpers/entries/hospital_entry";

// Constants
const hospitalEntry = {
  description: "Stable condition.",
  date: {
    year: "2025",
    month: "12",
    day: "31",
  },
  specialist: "Doctor Tester",
  diagnosisCodes: ["J10.1"],
  discharge: {
    date: {
      year: "2026",
      month: "01",
      day: "03",
    },
    criteria: "Patient has healed.",
  },
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
test.describe("Valid Hospital entries", () => {
  test("should add a new valid entry", async ({ page }) => {
    const initialEntriesLength = await page.locator(".patient-entry").count();
    await confirmPatientName(page, "John Johns");

    await addHospitalEntry(page, hospitalEntry);
    await expect(page.getByRole("alert")).toHaveText(
      "Entry was added successfully!",
    );

    const entries = page.locator(".patient-entry");
    await assertHospitalEntry(entries.first(), hospitalEntry);
    await expect(page.locator(".patient-entry")).toHaveCount(
      initialEntriesLength + 1,
    );
  });

  test("the diagnosis code field is optional", async ({ page }) => {
    const initialEntriesLength = await page.locator(".patient-entry").count();
    await confirmPatientName(page, "John Johns");

    const { diagnosisCodes, ...otherFields } = hospitalEntry;
    await addHospitalEntry(page, otherFields);
    await expect(page.getByRole("alert")).toHaveText(
      "Entry was added successfully!",
    );

    const entries = page.locator(".patient-entry");
    await assertHospitalEntry(entries.first(), otherFields);
    await expect(page.locator(".patient-entry")).toHaveCount(
      initialEntriesLength + 1,
    );
  });

  test("multiple diagnosis codes can be added", async ({ page }) => {
    const initialEntriesLength = await page.locator(".patient-entry").count();
    await confirmPatientName(page, "John Johns");

    const codes = ["M24.2", "M51.2", "S03.5", "J10.1", "J06.9"];

    const { diagnosisCodes, ...otherFields } = hospitalEntry;
    await addHospitalEntry(page, { ...otherFields, diagnosisCodes: codes });
    await expect(page.getByRole("alert")).toHaveText(
      "Entry was added successfully!",
    );

    const entries = page.locator(".patient-entry");
    await assertHospitalEntry(entries.first(), otherFields);
    await expect(page.locator(".patient-entry")).toHaveCount(
      initialEntriesLength + 1,
    );
  });
});

test.describe("Invalid Hospital entries", () => {
  test("missing the description field", async ({ page }) => {
    const initialEntriesLength = await page.locator(".patient-entry").count();
    await confirmPatientName(page, "John Johns");

    const { description, ...otherFields } = hospitalEntry;
    await addHospitalEntry(page, otherFields);
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

    const { date, ...otherFields } = hospitalEntry;
    await addHospitalEntry(page, otherFields);
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

    const { specialist, ...otherFields } = hospitalEntry;
    await addHospitalEntry(page, otherFields);
    await expect(page.getByRole("alert")).toHaveText(
      "Missing required field(s): Description, Date or Specialist",
    );
    await expect(page.locator(".patient-entry")).toHaveCount(
      initialEntriesLength,
    );
  });

  test("missing both of the discharge fields", async ({ page }) => {
    const initialEntriesLength = await page.locator(".patient-entry").count();
    await confirmPatientName(page, "John Johns");

    const { discharge, ...otherFields } = hospitalEntry;
    await addHospitalEntry(page, otherFields);
    await expect(page.getByRole("alert")).toHaveText(
      "The discharge field is required",
    );
    await expect(page.locator(".patient-entry")).toHaveCount(
      initialEntriesLength,
    );
  });

  test("missing the date of the discharge field", async ({ page }) => {
    const initialEntriesLength = await page.locator(".patient-entry").count();
    await confirmPatientName(page, "John Johns");

    const {
      discharge: { date: dischargeDate, ...otherDischarge },
      ...otherFields
    } = hospitalEntry;
    await addHospitalEntry(page, { ...otherFields, discharge: otherDischarge });
    await expect(page.getByRole("alert")).toHaveText(
      "Missing one of the discharge fields",
    );
    await expect(page.locator(".patient-entry")).toHaveCount(
      initialEntriesLength,
    );
  });

  test("missing the criteria of the discharge field", async ({ page }) => {
    const initialEntriesLength = await page.locator(".patient-entry").count();
    await confirmPatientName(page, "John Johns");

    const {
      discharge: { criteria: dischargeCriteria, ...otherDischarge },
      ...otherFields
    } = hospitalEntry;
    await addHospitalEntry(page, { ...otherFields, discharge: otherDischarge });
    await expect(page.getByRole("alert")).toHaveText(
      "Missing one of the discharge fields",
    );
    await expect(page.locator(".patient-entry")).toHaveCount(
      initialEntriesLength,
    );
  });
});
