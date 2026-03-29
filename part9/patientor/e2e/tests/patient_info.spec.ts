// Playwright dependencies
import { test, expect } from "@playwright/test";

// TypeScript types
import type { NonSensitivePatient } from "../../shared/types";

// Helper functions
import { assertHospitalEntry } from "./helpers/entries/hospital_entry";
import { assertHealthCheckEntry } from "./helpers/entries/healthcheck_entry";
import { assertOccupationalEntry } from "./helpers/entries/occupational_entry";
import { formatDate } from "./helpers/date_helper";

// Constants
const hospitalEntry = {
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
};

const healthCheckEntry = {
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
};

const occupationalEntry = {
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
};

// Creates a new patient with one entry for each type
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

  const patient = (await postResponse.json()) as NonSensitivePatient;

  // Adds one entry for each type
  await request.post(`/api/patients/${patient.id}/entries`, {
    data: {
      ...hospitalEntry,
      date: formatDate(hospitalEntry.date),
      discharge: {
        ...hospitalEntry.discharge,
        date: formatDate(hospitalEntry.discharge.date),
      },
    },
  });
  await request.post(`/api/patients/${patient.id}/entries`, {
    data: {
      ...healthCheckEntry,
      date: formatDate(healthCheckEntry.date),
    },
  });
  await request.post(`/api/patients/${patient.id}/entries`, {
    data: {
      ...occupationalEntry,
      date: formatDate(occupationalEntry.date),
      sickLeave: {
        startDate: formatDate(occupationalEntry.sickLeave.startDate),
        endDate: formatDate(occupationalEntry.sickLeave.endDate),
      },
    },
  });

  await page.goto("/");
  await expect(page.getByText("John Johns")).toBeVisible();
});

// E2E tests
test.describe("Patient full info page", () => {
  test("clicking on a patient's name should display all information", async ({
    page,
  }) => {
    await page
      .locator("tbody")
      .getByRole("link", { name: "John Johns" })
      .click();

    await expect(page.getByRole("heading", { level: 2 })).toHaveText(
      "John Johns",
    );
    await expect(page.getByTestId("MaleIcon")).toBeVisible();
    await expect(
      page.locator("p", { hasText: "ssn: 090786-122X" }),
    ).toBeVisible();
    await expect(
      page.locator("p", { hasText: "occupation: Developer" }),
    ).toBeVisible();
  });

  test("should display the list of entries if a patient has any", async ({
    page,
  }) => {
    await page
      .locator("tbody")
      .getByRole("link", { name: "John Johns" })
      .click();

    await expect(page.getByRole("heading", { level: 3 }).first()).toContainText(
      "Entries (3 total):",
    );
    const entries = page.locator(".patient-entry");
    await expect(entries).toHaveCount(3);
  });

  test("a Hospital entry should be properly displayed", async ({ page }) => {
    await page
      .locator("tbody")
      .getByRole("link", { name: "John Johns" })
      .click();

    const entries = page.locator(".patient-entry");
    await assertHospitalEntry(entries.nth(0), hospitalEntry);
  });

  test("a HealthCheck entry should be properly displayed", async ({ page }) => {
    await page
      .locator("tbody")
      .getByRole("link", { name: "John Johns" })
      .click();

    const entries = page.locator(".patient-entry");
    await assertHealthCheckEntry(entries.nth(1), healthCheckEntry);
  });

  test("an Occupational Healthcare entry should be properly displayed", async ({
    page,
  }) => {
    await page
      .locator("tbody")
      .getByRole("link", { name: "John Johns" })
      .click();

    const entries = page.locator(".patient-entry");
    await assertOccupationalEntry(entries.nth(2), occupationalEntry);
  });

  test("clicking on the page title should return to the main patient list", async ({
    page,
  }) => {
    await page
      .locator("tbody")
      .getByRole("link", { name: "John Johns" })
      .click();

    await expect(page.getByRole("heading", { level: 2 })).toHaveText(
      "John Johns",
    );

    await page.getByRole("link", { name: "Patientor" }).click();

    await expect(page.getByText("Patient list")).toBeVisible();
    const patients = page.locator("tbody").getByRole("row");
    await expect(patients).toHaveCount(6);
  });
});
