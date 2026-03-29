// Playwright dependencies
import { expect } from "@playwright/test";

// TypeScript types
import type { Page } from "playwright/test";

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
