// Playwright dependencies
import { test, expect } from "@playwright/test";

// TypeScript types
import type { NonSensitivePatient } from "../../shared/types";

// Helper functions
import { assertHospitalEntry, postHospitalRequest } from "./helpers/entries/hospital_entry";
import { assertHealthCheckEntry, postHealthCheckRequest } from "./helpers/entries/healthcheck_entry";
import { assertOccupationalEntry, postOccupationalRequest } from "./helpers/entries/occupational_entry";
import { accessPatientInfo } from "./helpers/patient_helpers";

// Constants
const newPatient = {
  name: "John Johns",
  ssn: "090786-122X",
  dateOfBirth: "1980-01-01",
  occupation: "Developer",
  gender: "male",
};

const newEntries = [
  {
    type: "Hospital",
    date: {
      year: "2025",
      month: "12",
      day: "31",
    },
    specialist: "Doctor Tester",
    diagnosisCodes: ["S62.5"],
    description: "Stable condition.",
    discharge: {
      date: {
        year: "2026",
        month: "01",
        day: "03",
      },
      criteria: "Patient has healed.",
    },
  },
  {
    type: "HealthCheck",
    date: {
      year: "2026",
      month: "01",
      day: "20",
    },
    specialist: "Doctor Tester",
    diagnosisCodes: ["J10.1"],
    description: "Patient showing classic flu symptoms.",
    healthCheckRating: 1,
  },
  {
    type: "OccupationalHealthcare",
    date: {
      year: "2026",
      month: "02",
      day: "15",
    },
    specialist: "Doctor Tester",
    diagnosisCodes: ["M51.2"],
    description: "Patient is having recurring back pains.",
    employerName: "Company",
    sickLeave: {
      startDate: {
        year: "2026",
        month: "02",
        day: "15",
      },
      endDate: {
        year: "2026",
        month: "03",
        day: "02",
      },
    },
  }
];

// Creates a new patient with one entry for each type
test.beforeEach(async ({ page, request }) => {
  // Resets the database to the original state before each test
  await page.request.post(`/api/testing/reset`);

  // Adds a new patient through the backend server
  const postResponse = await request.post(`/api/patients`, {
    data: { ...newPatient },
  });

  // ensure the request succeeded before proceeding
  expect(postResponse.ok()).toBeTruthy();

  const patient = (await postResponse.json()) as NonSensitivePatient;

  // Adds one new entry for each type
  await postHospitalRequest(patient.id, request, newEntries[0]);
  await postHealthCheckRequest(patient.id, request, newEntries[1]);
  await postOccupationalRequest(patient.id, request, newEntries[2]);

  // Navigates to the main page to confirm the patient has been added
  await page.goto("/");
  await expect(page.getByText(newPatient.name)).toBeVisible();
});

// E2E tests
test.describe("Patient full info page", () => {
  test("clicking on a patient's name should display all information", async ({
    page,
  }) => {
    await accessPatientInfo(page, newPatient.name);

    await expect(page.getByRole("heading", { level: 2 })).toHaveText(
      newPatient.name,
    );
    await expect(page.getByTestId("MaleIcon")).toBeVisible();
    await expect(
      page.locator("p", { hasText: `ssn: ${newPatient.ssn}` }),
    ).toBeVisible();
    await expect(
      page.locator("p", { hasText: `occupation: ${newPatient.occupation}` }),
    ).toBeVisible();
  });

  test("should display the list of entries if a patient has any", async ({
    page,
  }) => {
    await accessPatientInfo(page, newPatient.name);

    await expect(page.getByRole("heading", { level: 3 }).first()).toContainText(
      `${newEntries.length} total`,
    );
    const entries = page.locator(".patient-entry");
    await expect(entries).toHaveCount(newEntries.length);
  });
});

test.describe("The list of entries should be properly displayed", () => {
  test("a Hospital entry should be properly displayed", async ({ page }) => {
    await accessPatientInfo(page, newPatient.name);

    // Filter the desired entry based on its description
    const entry = page
      .locator(".patient-entry")
      .filter({ hasText: newEntries[0].description });
    await expect(entry).toHaveCount(1);
    await assertHospitalEntry(entry, newEntries[0]);
  });

  test("a HealthCheck entry should be properly displayed", async ({ page }) => {
    await accessPatientInfo(page, newPatient.name);

    // Filter the desired entry based on its description
    const entry = page
      .locator(".patient-entry")
      .filter({ hasText: newEntries[1].description });
    await expect(entry).toHaveCount(1);
    await assertHealthCheckEntry(entry, newEntries[1]);
  });

  test("an Occupational Healthcare entry should be properly displayed", async ({
    page,
  }) => {
    await accessPatientInfo(page, newPatient.name);

    // Filter the desired entry based on its description
    const entry = page
      .locator(".patient-entry")
      .filter({ hasText: newEntries[2].description });
    await expect(entry).toHaveCount(1);
    await assertOccupationalEntry(entry, newEntries[2]);
  });

  test("clicking on the page title should return to the main patient list", async ({
    page,
  }) => {
    await accessPatientInfo(page, newPatient.name);

    await expect(page.getByRole("heading", { level: 2 })).toHaveText(
      newPatient.name,
    );

    await page.getByRole("link", { name: "Patientor" }).click();
    await expect(page.getByText("Patient list")).toBeVisible();
  });
});
