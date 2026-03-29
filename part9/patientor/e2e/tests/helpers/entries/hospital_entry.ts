// Playwright dependencies
import { expect } from "playwright/test";

// TypeScript types
import type { Page, Locator } from "playwright/test";

// Helper functions
import { formatDate } from "../date_helper";

type HospitalEntryInput = {
  description?: unknown;
  date?: {
    year?: unknown,
    month?: unknown,
    day?: unknown
  };
  specialist?: unknown;
  diagnosisCodes?: unknown[];
  discharge?: {
    date?: {
      year?: unknown,
      month?: unknown,
      day?: unknown
    },
    criteria?: unknown,
  };
};

export async function addHospitalEntry(page: Page, data: HospitalEntryInput) {
  await page.getByRole('button', { name: 'Add new entry' }).click();
  await page.getByRole('combobox', { name: 'Entry type' }).click();
  await page.getByRole('option', { name: "Hospital", exact: true }).click();
    
  if (data.description !== undefined) {
    await page.getByRole('textbox', { name: 'Description' }).fill(String(data.description));
  }
  if (data.date !== undefined) {
    // Fill date using MUI segmented inputs (DatePicker internal structure)
    const dateGroup = page.getByRole('group', { name: 'Date' }).first();
    await dateGroup.getByRole('spinbutton', { name: 'Year' }).fill(String(data.date.year));
    await dateGroup.getByRole('spinbutton', { name: 'Month' }).fill(String(data.date.month));
    await dateGroup.getByRole('spinbutton', { name: 'Day' }).fill(String(data.date.day));
  }
  if (data.specialist !== undefined) {
    await page.getByRole('textbox', { name: 'Specialist' }).fill(String(data.specialist));
  }
  if (data.diagnosisCodes !== undefined) {
    if (data.diagnosisCodes.length > 0) {
      for (const code of data.diagnosisCodes) {
        await page.getByRole('combobox', { name: 'Diagnosis code' }).click();
        await page.getByRole('option', { name: String(code) }).click();
        await page.getByRole('button', { name: 'Add Diagnose', exact: true }).click();
      };
    }
  }
  if (data.discharge?.date) {
    const dischargeDate = page.getByRole('group', { name: 'Date' }).nth(1);
    await dischargeDate.getByRole('spinbutton', { name: 'Year' }).fill(String(data.discharge.date.year));
    await dischargeDate.getByRole('spinbutton', { name: 'Month' }).fill(String(data.discharge.date.month));
    await dischargeDate.getByRole('spinbutton', { name: 'Day' }).fill(String(data.discharge.date.day));
  }
  if (data.discharge?.criteria) {
    await page.getByRole('textbox', { name: 'Criteria' }).fill(String(data.discharge.criteria));
  }
  
  await page.getByRole('button', { name: 'Add', exact: true }).click();
}

export async function assertHospitalEntry(entry: Locator, data: HospitalEntryInput) {
  await expect(entry.locator('p', { 
    hasText: `${formatDate(data.date)}`
  })).toBeVisible();
  await expect(entry.getByTestId('LocalHospitalIcon')).toBeVisible();
  await expect(entry.locator('p', { hasText: String(data.description)})).toBeVisible();
  if (data.diagnosisCodes) {
    await expect(entry.getByRole('heading', { level: 3 }).filter({ hasText: 'Diagnoses codes:' })).toBeVisible();
    for (const code of data.diagnosisCodes) {
      await expect(entry.locator('li', { hasText: String(code) })).toBeVisible();
    }
  }
  await expect(entry.getByRole('heading', { level: 3 }).filter({ hasText: 'Discharge:'})).toBeVisible();
  await expect(entry.locator('li', { 
    hasText: `Date: ${formatDate(data.discharge?.date)}` 
  })).toBeVisible();
  await expect(entry.locator('li', { hasText: `Criteria: ${data.discharge?.criteria}`})).toBeVisible();
  await expect(entry.locator('em', { hasText: `diagnose by ${data.specialist}` })).toBeVisible();
}