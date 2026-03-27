import type { Page } from "playwright/test";

type PatientInput = {
  name?: unknown;
  ssn?: unknown;
  dateOfBirth?: {
    year?: unknown,
    month?: unknown,
    day?: unknown
  };
  occupation?: unknown;
  gender?: unknown;
};

export const addPatient = async (page: Page, data: PatientInput) => {
  await page.getByRole('button', { name: "Add New Patient" }).click();
    
  if (data.name !== undefined) {
    await page.getByRole('textbox', { name: 'Name' }).fill(String(data.name));
  }
  if (data.ssn !== undefined) {
    await page.getByRole('textbox', { name: 'Social security number' }).fill(String(data.ssn));
  }
  if (data.dateOfBirth !== undefined) {
    // Fill date of birth using MUI segmented inputs (DatePicker internal structure)
    const dateGroup = page.getByRole('group', { name: 'Date of birth' });
    await dateGroup.getByRole('spinbutton', { name: 'Year' }).fill(String(data.dateOfBirth.year));
    await dateGroup.getByRole('spinbutton', { name: 'Month' }).fill(String(data.dateOfBirth.month));
    await dateGroup.getByRole('spinbutton', { name: 'Day' }).fill(String(data.dateOfBirth.day));
  }
  if (data.occupation !== undefined) {
    await page.getByRole('textbox', { name: 'Occupation' }).fill(String(data.occupation));
  }
  if (data.gender !== undefined) {
    await page
      .getByText('Gender')
      .locator('..')
      .getByRole('combobox')
      .click();
    await page.getByRole('option', { name: String(data.gender), exact: true }).click();
  }
  
  await page.getByRole('button', { name: 'Add' }).click();
};