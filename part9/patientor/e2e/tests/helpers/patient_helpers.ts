// Playwright dependencies
import { expect } from "@playwright/test";

// TypeScript types
import type { Page } from "playwright/test";

type PatientInput = {
  name?: unknown;
  ssn?: unknown;
  dateOfBirth?: {
    year?: unknown;
    month?: unknown;
    day?: unknown;
  };
  occupation?: unknown;
  gender?: unknown;
};

// Adds a new patient through the frontend
export async function addPatient(page: Page, data: PatientInput) {
  await page.getByRole("button", { name: "Add New Patient" }).click();

  if (data.name !== undefined) {
    await page.getByRole("textbox", { name: "Name" }).fill(String(data.name));
  }
  if (data.ssn !== undefined) {
    await page
      .getByRole("textbox", { name: "Social security number" })
      .fill(String(data.ssn));
  }
  if (data.dateOfBirth !== undefined) {
    // Fill date of birth using MUI segmented inputs (DatePicker internal structure)
    const dateGroup = page.getByRole("group", { name: "Date of birth" });
    await dateGroup
      .getByRole("spinbutton", { name: "Year" })
      .fill(String(data.dateOfBirth.year));
    await dateGroup
      .getByRole("spinbutton", { name: "Month" })
      .fill(String(data.dateOfBirth.month));
    await dateGroup
      .getByRole("spinbutton", { name: "Day" })
      .fill(String(data.dateOfBirth.day));
  }
  if (data.occupation !== undefined) {
    await page
      .getByRole("textbox", { name: "Occupation" })
      .fill(String(data.occupation));
  }
  if (data.gender !== undefined) {
    await page.getByRole("combobox", { name: "Gender" }).click();
    await page
      .getByRole("option", { name: String(data.gender), exact: true })
      .click();
  }

  await page.getByRole("button", { name: "Add" }).click();
}

// Access a patients' information page
export async function accessPatientInfo(page: Page, name: string) {
  await page.locator("tbody").getByRole("link", { name: name }).click();
  await expect(page.getByRole("heading", { level: 2 })).toHaveText(name);
}

// Asserts a patient is not present on the main page list
export async function assertNotPresent(
  page: Page,
  patientName: string,
  initialPatientsLength: number,
) {
  const patients = page.locator("tbody").getByRole("row");
  await expect(patients).toHaveCount(initialPatientsLength);

  await expect(
    page
      .locator("tbody")
      .getByRole("row")
      .filter({ has: page.getByRole("link", { name: patientName }) }),
  ).toHaveCount(0);
}

// Gets the total number of patients fro the main page list
export async function getPatientCount(page: Page): Promise<number> {
  const patientListLength = await page
    .locator("tbody")
    .getByRole("row")
    .count();
  return patientListLength;
}

// Tests adding a new patient with a missing field
export async function testMissingField(
  page: Page,
  patientInfo: PatientInput,
  errorMessage: string,
  patientCount: number,
) {
  // Wait for the expected initial data to be present first
  await expect(page.locator("tbody").getByRole("row")).toHaveCount(
    patientCount,
  );

  // Add a new patient
  await addPatient(page, patientInfo);

  // Confirm error message appears on the form
  await expect(page.getByRole("alert")).toHaveText(errorMessage);
}
