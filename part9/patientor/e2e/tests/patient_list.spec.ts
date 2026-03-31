// Data
import patients from "../../server/src/data/patients";

// Playwright dependencies
import { test, expect } from "@playwright/test";

// Helper functions
import { setupTestPatient } from "./helpers/setup";
import {
  addPatient,
  assertNotPresent,
  getPatientCount,
  testMissingField,
} from "./helpers/patient_helpers";

// Constants
import { newPatient } from "./helpers/constants";

const initialPatientListLength = patients.length;

test.beforeEach(async ({ page }) => {
  // Reset the database to the original state before each test
  await page.request.post(`/api/testing/reset`);

  // Navigate to the home page
  await page.goto("/");

  // Wait for the full list to be present before proceeding
  await expect(page.locator("tbody").getByRole("row")).toHaveCount(
    initialPatientListLength,
  );
});

// E2E tests
test.describe("Testing the home page", () => {
  test("Front page can be opened", async ({ page }) => {
    // Check the main page title
    await expect(page).toHaveTitle(/Patientor/);

    // Confirm the sub-title is present
    const locator = page.getByText("Patient list");
    await expect(locator).toBeVisible();
  });

  test("should display the list of patients", async ({ page }) => {
    // Confirm the total number of patients is present
    const patients = page.locator("tbody").getByRole("row");
    await expect(patients).toHaveCount(initialPatientListLength);
  });

  test("should display a patients' non-sensitive information", async ({
    page,
    request,
  }) => {
    // Add a new patient for testing
    await setupTestPatient(page, request);

    // Filter a patient based on its name
    const row = page
      .locator("tbody")
      .getByRole("row")
      .filter({ has: page.getByRole("link", { name: newPatient.name }) });

    // Assert the data is correct
    await expect(
      row.getByRole("link", { name: newPatient.name }),
    ).toBeVisible();
    await expect(
      row.getByRole("cell", { name: newPatient.gender }),
    ).toBeVisible();
    await expect(
      row.getByRole("cell", { name: newPatient.occupation }),
    ).toBeVisible();
  });
});

test.describe("Testing the add new patient form", () => {
  test("should display the form when clicking on the Add New Patient button", async ({
    page,
  }) => {
    // Open the add form
    await page.getByRole("button", { name: "Add New Patient" }).click();

    // Assert all fields are present
    await expect(page.getByLabel("Name")).toBeVisible();
    await expect(page.getByLabel("Social security number")).toBeVisible();
    await expect(
      page.getByRole("group", { name: "Date of birth" }),
    ).toBeVisible();
    await expect(page.getByLabel("Occupation")).toBeVisible();
    await expect(
      page.locator("label").filter({ hasText: "Gender" }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Add" })).toBeVisible();
  });

  test("should add a new patient when clicking on the Add button", async ({
    page,
  }) => {
    // Add a new patient
    await addPatient(page, newPatient);

    // Confirm the list of patients has increased
    const patientListLength = await getPatientCount(page);
    expect(patientListLength).toEqual(initialPatientListLength + 1);

    // Assert the patient data is correct
    const row = page
      .locator("tbody")
      .getByRole("row")
      .filter({ has: page.getByRole("link", { name: newPatient.name }) });
    await expect(
      row.getByRole("cell", { name: newPatient.gender }),
    ).toBeVisible();
    await expect(
      row.getByRole("cell", { name: newPatient.occupation }),
    ).toBeVisible();
  });

  test("the cancel button should not add a new patient", async ({ page }) => {
    // Open the add form
    await page.getByRole("button", { name: "Add New Patient" }).click();

    // Fill patient information
    await page.getByRole("textbox", { name: "Name" }).fill(newPatient.name);
    await page
      .getByRole("textbox", { name: "Social security number" })
      .fill(newPatient.ssn);
    const dateGroup = page.getByRole("group", { name: "Date of birth" });
    await dateGroup
      .getByRole("spinbutton", { name: "Year" })
      .fill(String(newPatient.dateOfBirth.year));
    await dateGroup
      .getByRole("spinbutton", { name: "Month" })
      .fill(String(newPatient.dateOfBirth.month));
    await dateGroup
      .getByRole("spinbutton", { name: "Day" })
      .fill(String(newPatient.dateOfBirth.day));
    await page
      .getByRole("textbox", { name: "Occupation" })
      .fill(newPatient.occupation);
    await page.getByRole("combobox", { name: "Gender" }).click();
    await page
      .getByRole("option", { name: newPatient.gender, exact: true })
      .click();

    // Click on the cancel button and confirm no new patient has been added
    await page.getByRole("button", { name: "Cancel" }).click();
    await assertNotPresent(page, newPatient.name, initialPatientListLength);
  });

  test("missing the name field", async ({ page }) => {
    // Remove the field to test
    const { name, ...otherFields } = newPatient;
    const errorMessage = "Patient name is required";

    // Test the form with the missing field
    await testMissingField(
      page,
      otherFields,
      errorMessage,
      initialPatientListLength,
    );

    // Assert no patient has been added
    await page.getByRole("button", { name: "Cancel" }).click();
    await assertNotPresent(page, newPatient.name, initialPatientListLength);
  });

  test("missing the ssn field", async ({ page }) => {
    // Remove the field to test
    const { ssn, ...otherFields } = newPatient;
    const errorMessage = "Patient SSN is required";

    // Test the form with the missing field
    await testMissingField(
      page,
      otherFields,
      errorMessage,
      initialPatientListLength,
    );

    // Assert no patient has been added
    await page.getByRole("button", { name: "Cancel" }).click();
    await assertNotPresent(page, newPatient.name, initialPatientListLength);
  });

  test("missing the date of birth field", async ({ page }) => {
    // Remove the field to test
    const { dateOfBirth, ...otherFields } = newPatient;
    const errorMessage = "Invalid ISO date";

    // Test the form with the missing field
    await testMissingField(
      page,
      otherFields,
      errorMessage,
      initialPatientListLength,
    );

    // Assert no patient has been added
    await page.getByRole("button", { name: "Cancel" }).click();
    await assertNotPresent(page, newPatient.name, initialPatientListLength);
  });

  test("missing the year on the date of birth field", async ({ page }) => {
    // Remove the field to test
    const {
      dateOfBirth: { year: birthYear, ...otherDateOfBirthFields },
      ...otherFields
    } = newPatient;
    const errorMessage = "Invalid ISO date";

    // Test the form with the missing field
    await testMissingField(
      page,
      { ...otherFields, dateOfBirth: otherDateOfBirthFields },
      errorMessage,
      initialPatientListLength,
    );

    // Assert no patient has been added
    await page.getByRole("button", { name: "Cancel" }).click();
    await assertNotPresent(page, newPatient.name, initialPatientListLength);
  });

  test("missing the month on the date of birth field", async ({ page }) => {
    // Remove the field to test
    const {
      dateOfBirth: { month: birthMonth, ...otherDateOfBirthFields },
      ...otherFields
    } = newPatient;
    const errorMessage = "Invalid ISO date";

    // Test the form with the missing field
    await testMissingField(
      page,
      { ...otherFields, dateOfBirth: otherDateOfBirthFields },
      errorMessage,
      initialPatientListLength,
    );

    // Assert no patient has been added
    await page.getByRole("button", { name: "Cancel" }).click();
    await assertNotPresent(page, newPatient.name, initialPatientListLength);
  });

  test("missing the day on the date of birth field", async ({ page }) => {
    // Remove the field to test
    const {
      dateOfBirth: { day: birthDay, ...otherDateOfBirthFields },
      ...otherFields
    } = newPatient;
    const errorMessage = "Invalid ISO date";

    // Test the form with the missing field
    await testMissingField(
      page,
      { ...otherFields, dateOfBirth: otherDateOfBirthFields },
      errorMessage,
      initialPatientListLength,
    );

    // Assert no patient has been added
    await page.getByRole("button", { name: "Cancel" }).click();
    await assertNotPresent(page, newPatient.name, initialPatientListLength);
  });

  test("missing the occupation field", async ({ page }) => {
    // Remove the field to test
    const { occupation, ...otherFields } = newPatient;
    const errorMessage = "Patient occupation is required";

    // Test the form with the missing field
    await testMissingField(
      page,
      otherFields,
      errorMessage,
      initialPatientListLength,
    );

    // Assert no patient has been added
    await page.getByRole("button", { name: "Cancel" }).click();
    await assertNotPresent(page, newPatient.name, initialPatientListLength);
  });
});
