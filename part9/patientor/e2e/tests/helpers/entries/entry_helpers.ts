// Playwright dependencies
import { expect } from "@playwright/test";

// Helper functions
import { accessPatientInfo } from "../patient_helpers";

// TypeScript types
import type { Page } from "playwright/test";

// Access the patient info page and count the number of entries
export async function accessPatientEntries(
  page: Page,
  patientName: string,
): Promise<number> {
  await accessPatientInfo(page, patientName);

  // Count the number of initial entries
  const entries = page.locator(".patient-entry");
  const count = await entries.count();

  // Wait for the entries to be rendered on the page
  if (count > 0) {
    await expect(entries.first()).toBeVisible();
  }

  return count;
}

// Check if the common fields between all available types are present on a form
export async function checkCommonEntryFields(page: Page) {
  await expect(
    page.locator("label").filter({ hasText: "Entry type" }),
  ).toBeVisible();
  await expect(
    page.getByRole("textbox", { name: "Description" }),
  ).toBeVisible();
  await expect(page.getByRole("group", { name: "Date" }).first()).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Specialist" })).toBeVisible();
  await expect(
    page.locator("label").filter({ hasText: "Diagnosis code" }),
  ).toBeVisible();
  await expect(
    page.getByRole("combobox", { name: "Diagnosis code" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Add Diagnose" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Add", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Cancel", exact: true }),
  ).toBeVisible();
}
