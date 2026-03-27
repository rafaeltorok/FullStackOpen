// Playwright dependencies
import { test, expect } from "@playwright/test";

// URLs
const serverUrl = "http://localhost:3001";
const clientUrl = "http://localhost:5173";

// Helper functions
import { addPatient } from "./helpers/addPatient";

// E2E tests
test.beforeEach(async ({ page }) => {
  // Resets the database to the original state before each test
  await page.request.post(`${serverUrl}/api/testing/reset`);
  // Navigate to the home page
  await page.goto(clientUrl);
});

test.describe("Testing the web app home page", () => {
  test("Front page can be opened", async ({ page }) => {
    // Checks the main page title
    await expect(page).toHaveTitle(/Patientor/);
    // Checks if the sub-title is present
    const locator = page.getByText("Patient list");
    await expect(locator).toBeVisible();
  });

  test("should display the list of patients", async ({ page }) => {
    const patients = page.locator("tbody").getByRole("row");
    await expect(patients).toHaveCount(5);
  });

  test("should display a patients' non-sensitive information", async ({ page }) => {
    const row = page
      .locator('tbody')
      .getByRole('row')
      .filter({ has: page.getByRole('link', { name: 'John McClane' }) });
    await expect(row.getByRole('link', { name: 'John McClane' })).toBeVisible();
    await expect(row.getByRole('cell', { name: 'male' })).toBeVisible();
    await expect(row.getByRole('cell', { name: 'New york city cop' })).toBeVisible();
  });
});

test.describe("Testing the add new patient form", () => {
  test("should display the form when clicking on the Add New Patient button", async ({ page }) => {
    await page.getByRole('button', { name: "Add New Patient" }).click();
    await expect(page.getByLabel('Name')).toBeVisible();
    await expect(page.getByLabel('Social security number')).toBeVisible();
    await expect(page.getByRole('group', { name: 'Date of birth' })).toBeVisible();
    await expect(page.getByLabel('Occupation')).toBeVisible();
    await expect(page.locator('label').filter({ hasText: 'Gender' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add' })).toBeVisible();
  });

  test("should add a new patient when clicking on the Add button", async ({ page }) => {
    const initialPatientsLength = await page.locator("tbody").getByRole("row").count();
    const patientData = {
      name: "John Johns",
      ssn: "01-010101",
      dateOfBirth: {
        year: 1980,
        month: 1,
        day: 1
      },
      occupation: "Developer",
      gender: 'male'
    };
    await addPatient(page, patientData);

    const patients = page.locator("tbody").getByRole("row");
    await expect(patients).toHaveCount(initialPatientsLength + 1);

    const row = page
      .locator('tbody')
      .getByRole('row')
      .filter({ has: page.getByRole('link', { name: 'John Johns' }) });
    await expect(row.getByRole('link', { name: 'John Johns' })).toBeVisible();
    await expect(row.getByRole('cell', { name: 'male' })).toBeVisible();
    await expect(row.getByRole('cell', { name: 'Developer' })).toBeVisible();
  });

  test("missing the name field", async ({ page }) => {
    const initialPatientsLength = await page.locator("tbody").getByRole("row").count();
    const patientData = {
      ssn: "01-010101",
      dateOfBirth: {
        year: 1980,
        month: 1,
        day: 1
      },
      occupation: "Developer",
      gender: 'male'
    };
    await addPatient(page, patientData);

    await expect(page.getByRole("alert")).toContainText("Patient name is required");

    await page.getByRole('button', { name: 'Cancel' }).click();

    const patients = page.locator("tbody").getByRole("row");
    await expect(patients).toHaveCount(initialPatientsLength);

    await expect(page
      .locator('tbody')
      .getByRole('row')
      .filter({ has: page.getByRole('link', { name: 'John Johns' }) }))
      .toHaveCount(0);
  });

  test("missing the ssn field", async ({ page }) => {
    const initialPatientsLength = await page.locator("tbody").getByRole("row").count();
    const patientData = {
      name: "John Johns",
      dateOfBirth: {
        year: 1980,
        month: 1,
        day: 1
      },
      occupation: "Developer",
      gender: 'male'
    };
    await addPatient(page, patientData);

    await expect(page.getByRole("alert")).toContainText("Patient SSN is required");

    await page.getByRole('button', { name: 'Cancel' }).click();

    const patients = page.locator("tbody").getByRole("row");
    await expect(patients).toHaveCount(initialPatientsLength);

    await expect(page
      .locator('tbody')
      .getByRole('row')
      .filter({ has: page.getByRole('link', { name: 'John Johns' }) }))
      .toHaveCount(0);
  });

  test("missing the date of birth field", async ({ page }) => {
    const initialPatientsLength = await page.locator("tbody").getByRole("row").count();
    const patientData = {
      name: "John Johns",
      ssn: "01-010101",
      occupation: "Developer",
      gender: 'male'
    };
    await addPatient(page, patientData);

    await expect(page.getByRole("alert")).toContainText("Invalid ISO date");

    await page.getByRole('button', { name: 'Cancel' }).click();

    const patients = page.locator("tbody").getByRole("row");
    await expect(patients).toHaveCount(initialPatientsLength);

    await expect(page
      .locator('tbody')
      .getByRole('row')
      .filter({ has: page.getByRole('link', { name: 'John Johns' }) }))
      .toHaveCount(0);
  });

  test("missing the occupation field", async ({ page }) => {
    const initialPatientsLength = await page.locator("tbody").getByRole("row").count();
    const patientData = {
      name: "John Johns",
      ssn: "01-010101",
      dateOfBirth: {
        year: 1980,
        month: 1,
        day: 1
      },
      gender: 'male'
    };
    await addPatient(page, patientData);

    await expect(page.getByRole("alert")).toContainText("Patient occupation is required");

    await page.getByRole('button', { name: 'Cancel' }).click();

    const patients = page.locator("tbody").getByRole("row");
    await expect(patients).toHaveCount(initialPatientsLength);

    await expect(page
      .locator('tbody')
      .getByRole('row')
      .filter({ has: page.getByRole('link', { name: 'John Johns' }) }))
      .toHaveCount(0);
  });

  test("the cancel button should not add a new patient", async ({ page }) => {
    const initialPatientsLength = await page.locator("tbody").getByRole("row").count();

    await page.getByRole('button', { name: "Add New Patient" }).click();
    await page.getByRole('textbox', { name: 'Name' }).fill("John Johns");
    await page.getByRole('textbox', { name: 'Social security number' }).fill("01-010101");
    const dateGroup = page.getByRole('group', { name: 'Date of birth' });
    await dateGroup.getByRole('spinbutton', { name: 'Year' }).fill("1980");
    await dateGroup.getByRole('spinbutton', { name: 'Month' }).fill("01");
    await dateGroup.getByRole('spinbutton', { name: 'Day' }).fill("01");
    await page.getByRole('textbox', { name: 'Occupation' }).fill("Developer");
    await page
      .getByText('Gender')
      .locator('..')
      .getByRole('combobox')
      .click();
    await page.getByRole('option', { name: "male", exact: true }).click();

    await page.getByRole('button', { name: 'Cancel' }).click();

    const patients = page.locator("tbody").getByRole("row");
    await expect(patients).toHaveCount(initialPatientsLength);

    await expect(page
      .locator('tbody')
      .getByRole('row')
      .filter({ has: page.getByRole('link', { name: 'John Johns' }) }))
      .toHaveCount(0);
  });
});