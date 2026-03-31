// Playwright dependencies
import { test, expect } from "@playwright/test";

// Helper functions
import { setupTestPatient } from "./helpers/setup";
import { checkCommonEntryFields } from "./helpers/entries/entry_helpers";
import { accessPatientInfo } from "./helpers/patient_helpers";
import { fillEntryForm } from "./helpers/entries/hospital_entry";

// Constants
import { newPatient, hospitalEntry } from "./helpers/constants";

// Posts a new patient with no entries
test.beforeEach(async ({ page, request }) => {
  // Add a new patient through the backend server
  await setupTestPatient(page, request);
});

// E2E tests
test.describe("Testing the add new entry form", () => {
  test("the add new entry button should display a form", async ({ page }) => {
    await accessPatientInfo(page, newPatient.name);

    // Click the button to open the add entry form
    await page.getByRole("button", { name: "Add new entry" }).click();

    // Checks only the common fields between all entry types
    await checkCommonEntryFields(page);
  });

  test("the cancel button should hide the entry form", async ({ page }) => {
    await accessPatientInfo(page, newPatient.name);

    // Click the button to open the add entry form
    await page.getByRole("button", { name: "Add new entry" }).click();

    // Confirms the form is displayed
    await expect(
      page.locator("label").filter({ hasText: "Entry type" }),
    ).toBeVisible();

    // Confirms the Cancel button exists and can be clicked on
    const cancelButton = page.getByRole("button", {
      name: "Cancel",
      exact: true,
    });
    await expect(cancelButton).toBeVisible();
    await cancelButton.click();

    // Checks if the form is truly hidden
    await expect(
      page.getByRole("button", { name: "Add new entry" }),
    ).toBeVisible();
    await expect(
      page.locator("label").filter({ hasText: "Entry type" }),
    ).toBeHidden();
  });

  test("the cancel button should not add a new entry", async ({ page }) => {
    const initialEntryCount = await page.locator(".patient-helper").count();

    // Clicks on a patient's name to access the full information page
    await accessPatientInfo(page, newPatient.name);

    // Fill entry information
    await fillEntryForm(page, hospitalEntry);

    // Confirm the Cancel button exists and can be clicked on
    const cancelButton = page.getByRole("button", {
      name: "Cancel",
      exact: true,
    });
    await expect(cancelButton).toBeVisible();
    await cancelButton.click();

    // Check if the form is truly hidden
    await expect(
      page.getByRole("button", { name: "Add new entry" }),
    ).toBeVisible();
    await expect(
      page.locator("label").filter({ hasText: "Entry type" }),
    ).toBeHidden();

    // Confirm that no entry has been added
    await expect(page.locator(".patient-helper")).toHaveCount(
      initialEntryCount,
    );
  });

  test("should display all fields for a new Hospital entry", async ({
    page,
  }) => {
    await accessPatientInfo(page, newPatient.name);

    // Open the entry form and select the Hospital type
    await page.getByRole("button", { name: "Add new entry" }).click();
    await page.getByRole("combobox", { name: "Entry type" }).click();
    await page.getByRole("option", { name: "Hospital", exact: true }).click();

    // Assert all fields are present
    await checkCommonEntryFields(page);
    await expect(
      page.locator("label").filter({ hasText: "Discharge" }),
    ).toBeVisible();
    await expect(
      page.getByRole("group", { name: "Date" }).nth(1),
    ).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Criteria" })).toBeVisible();
  });

  test("should display all fields for a new HealthCheck entry", async ({
    page,
  }) => {
    await accessPatientInfo(page, newPatient.name);

    // Open the entry form and select the HealthCheck type
    await page.getByRole("button", { name: "Add new entry" }).click();
    await page.getByRole("combobox", { name: "Entry type" }).click();
    await page
      .getByRole("option", { name: "HealthCheck", exact: true })
      .click();

    // Assert all fields are present
    await checkCommonEntryFields(page);
    await expect(
      page.locator("label").filter({ hasText: "Health Rating" }),
    ).toBeVisible();
    await expect(
      page.getByRole("combobox", { name: "Health Rating" }),
    ).toBeVisible();
  });

  test("should display all fields for a new Occupational Healthcare entry", async ({
    page,
  }) => {
    await accessPatientInfo(page, newPatient.name);

    // Open the entry form and select the OccupationalHealthcare type
    await page.getByRole("button", { name: "Add new entry" }).click();
    await page.getByRole("combobox", { name: "Entry type" }).click();
    await page
      .getByRole("option", { name: "OccupationalHealthcare", exact: true })
      .click();

    // Assert all fields are present
    await checkCommonEntryFields(page);
    await expect(
      page.locator("label").filter({ hasText: "Sick leave" }),
    ).toBeVisible();
    await expect(
      page.getByRole("group", { name: "Start date", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("group", { name: "End date", exact: true }),
    ).toBeVisible();
  });
});
