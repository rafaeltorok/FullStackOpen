// Playwright dependencies
import { test, expect } from "@playwright/test";

// Helper functions
import { checkCommonEntryFields } from "./helpers/entries/entry_helpers";
import { accessPatientInfo } from "./helpers/patient_helpers";

// Constants
const newPatient = {
  name: "John Johns",
  ssn: "090786-122X",
  dateOfBirth: "1980-01-01",
  occupation: "Developer",
  gender: "male",
}

// Posts a new patient with no entries
test.beforeEach(async ({ page, request }) => {
  // Resets the database to the original state before each test
  await page.request.post(`/api/testing/reset`);

  // Adds a new patient through the backend server
  const postResponse = await request.post(`/api/patients`, {
    data: { ...newPatient },
  });

  // ensure the request succeeded before proceeding
  expect(postResponse.ok()).toBeTruthy();

  // Navigates to the main page to confirm the patient has been added
  await page.goto("/");
  await expect(page.getByText(newPatient.name)).toBeVisible();
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

    const data = {
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

    // Clicks on a patient's name to access the full information page
    await accessPatientInfo(page, newPatient.name);

    // Click on the button to open the add entry form
    await page.getByRole("button", { name: "Add new entry" }).click();
    await page.getByRole("combobox", { name: "Entry type" }).click();
    await page.getByRole("option", { name: "Hospital", exact: true }).click();

    // Fill entry information
    await page
      .getByRole("textbox", { name: "Description" })
      .fill(data.description);
    // Fill date using MUI segmented inputs (DatePicker internal structure)
    const dateGroup = page.getByRole("group", { name: "Date" }).first();
    await dateGroup
      .getByRole("spinbutton", { name: "Year" })
      .fill(data.date.year);
    await dateGroup
      .getByRole("spinbutton", { name: "Month" })
      .fill(data.date.month);
    await dateGroup
      .getByRole("spinbutton", { name: "Day" })
      .fill(data.date.day);
    await page
      .getByRole("textbox", { name: "Specialist" })
      .fill(data.specialist);
    await page.getByRole("combobox", { name: "Diagnosis code" }).click();
    await page.getByRole("option", { name: data.diagnosisCodes[0] }).click();
    await page
      .getByRole("button", { name: "Add Diagnose", exact: true })
      .click();

    const dischargeDate = page.getByRole("group", { name: "Date" }).nth(1);
    await dischargeDate
      .getByRole("spinbutton", { name: "Year" })
      .fill(data.discharge.date.year);
    await dischargeDate
      .getByRole("spinbutton", { name: "Month" })
      .fill(data.discharge.date.month);
    await dischargeDate
      .getByRole("spinbutton", { name: "Day" })
      .fill(data.discharge.date.day);
    await page
      .getByRole("textbox", { name: "Criteria" })
      .fill(data.discharge.criteria);

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
    await expect(page.locator(".patient-helper")).toHaveCount(initialEntryCount);
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

    // Open the entry form and select the Hospital type
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

    // Open the entry form and select the Hospital type
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
