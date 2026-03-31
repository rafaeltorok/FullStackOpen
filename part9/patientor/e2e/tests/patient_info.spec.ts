// Playwright dependencies
import { test, expect } from "@playwright/test";

// Helper functions
import {
  assertHospitalEntry,
  postHospitalRequest,
} from "./helpers/entries/hospital_entry";
import {
  assertHealthCheckEntry,
  postHealthCheckRequest,
} from "./helpers/entries/healthcheck_entry";
import {
  assertOccupationalEntry,
  postOccupationalRequest,
} from "./helpers/entries/occupational_entry";
import { accessPatientInfo } from "./helpers/patient_helpers";

// Constants
import { newPatient } from "./helpers/constants";
import {
  hospitalEntry,
  healthCheckEntry,
  occupationalEntry,
} from "./helpers/constants";
import { setupTestPatient } from "./helpers/setup";

const newEntries = [hospitalEntry, healthCheckEntry, occupationalEntry];

// Creates a new patient with one entry for each type
test.beforeEach(async ({ page, request }) => {
  // Add a new patient
  const patient = await setupTestPatient(page, request);

  // Add one new entry for each type
  await postHospitalRequest(patient.id, request, newEntries[0]);
  await postHealthCheckRequest(patient.id, request, newEntries[1]);
  await postOccupationalRequest(patient.id, request, newEntries[2]);

  // Navigate to the main page to confirm the patient has been added
  await page.goto("/");
  await expect(page.getByText(newPatient.name)).toBeVisible();
});

// E2E tests
test.describe("Patient full info page", () => {
  test("clicking on a patient's name should display all information", async ({
    page,
  }) => {
    // Click on a patient's name to access the information page
    await accessPatientInfo(page, newPatient.name);

    // Assert all personal information is present
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
    // Click on a patient's name to access the information page
    await accessPatientInfo(page, newPatient.name);

    // Assert all entries are present and the total number is correct
    await expect(page.getByRole("heading", { level: 3 }).first()).toContainText(
      `${newEntries.length} total`,
    );
    const entries = page.locator(".patient-entry");
    await expect(entries).toHaveCount(newEntries.length);
  });
});

test.describe("Each entry of the list should be properly displayed", () => {
  test("a Hospital entry should be properly displayed", async ({ page }) => {
    // Click on a patient's name to access the information page
    await accessPatientInfo(page, newPatient.name);

    // Filter the desired entry based on its description
    const entry = page
      .locator(".patient-entry")
      .filter({ hasText: newEntries[0].description });

    // Assert the entry has been added successfully
    await expect(entry).toHaveCount(1);
    await assertHospitalEntry(entry, newEntries[0]);
  });

  test("a HealthCheck entry should be properly displayed", async ({ page }) => {
    // Click on a patient's name to access the information page
    await accessPatientInfo(page, newPatient.name);

    // Filter the desired entry based on its description
    const entry = page
      .locator(".patient-entry")
      .filter({ hasText: newEntries[1].description });

    // Assert the entry has been added successfully
    await expect(entry).toHaveCount(1);
    await assertHealthCheckEntry(entry, newEntries[1]);
  });

  test("an Occupational Healthcare entry should be properly displayed", async ({
    page,
  }) => {
    // Click on a patient's name to access the information page
    await accessPatientInfo(page, newPatient.name);

    // Filter the desired entry based on its description
    const entry = page
      .locator(".patient-entry")
      .filter({ hasText: newEntries[2].description });

    // Assert the entry has been added successfully
    await expect(entry).toHaveCount(1);
    await assertOccupationalEntry(entry, newEntries[2]);
  });

  test("clicking on the page title should return to the main patient list", async ({
    page,
  }) => {
    // Click on a patient's name to access the information page
    await accessPatientInfo(page, newPatient.name);

    // Click on the link present on the page's main title
    await expect(page.getByRole("heading", { level: 2 })).toHaveText(
      newPatient.name,
    );

    // Confirm the browser has returned to the main page
    await page.getByRole("link", { name: "Patientor" }).click();
    await expect(page.getByText("Patient list")).toBeVisible();
  });
});
