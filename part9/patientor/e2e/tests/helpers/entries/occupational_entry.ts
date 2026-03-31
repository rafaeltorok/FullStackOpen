// Playwright dependencies
import { expect } from "playwright/test";

// TypeScript types
import type {
  Page,
  Locator,
  APIResponse,
  APIRequestContext,
} from "playwright/test";

// Helper functions
import { formatDate } from "../date_helper";

// TypeScript types
import type { OccupationalEntryInput } from "../types";

// Fill the new entry form
export async function fillEntryForm(page: Page, data: OccupationalEntryInput) {
  await page.getByRole("button", { name: "Add new entry" }).click();
  await page.getByRole("combobox", { name: "Entry type" }).click();
  await page
    .getByRole("option", { name: "OccupationalHealthcare", exact: true })
    .click();

  if (data.description !== undefined) {
    await page
      .getByRole("textbox", { name: "Description" })
      .fill(String(data.description));
  }
  if (data.date !== undefined) {
    // Fill date using MUI segmented inputs (DatePicker internal structure)
    const dateGroup = page.getByRole("group", { name: "Date" }).first();
    await dateGroup
      .getByRole("spinbutton", { name: "Year" })
      .fill(String(data.date.year));
    await dateGroup
      .getByRole("spinbutton", { name: "Month" })
      .fill(String(data.date.month));
    await dateGroup
      .getByRole("spinbutton", { name: "Day" })
      .fill(String(data.date.day));
  }
  if (data.specialist !== undefined) {
    await page
      .getByRole("textbox", { name: "Specialist" })
      .fill(String(data.specialist));
  }
  if (data.employerName) {
    await page
      .getByRole("textbox", { name: "Employer name" })
      .fill(String(data.employerName));
  }
  if (data.diagnosisCodes !== undefined) {
    if (data.diagnosisCodes.length > 0) {
      for (const code of data.diagnosisCodes) {
        await page.getByRole("combobox", { name: "Diagnosis code" }).click();
        await page.getByRole("option", { name: String(code) }).click();
        await page
          .getByRole("button", { name: "Add Diagnose", exact: true })
          .click();
      }
    }
  }
  if (data.sickLeave?.startDate) {
    const startDate = page.getByRole("group", { name: "Start date" });
    await startDate
      .getByRole("spinbutton", { name: "Year" })
      .fill(String(data.sickLeave.startDate.year));
    await startDate
      .getByRole("spinbutton", { name: "Month" })
      .fill(String(data.sickLeave.startDate.month));
    await startDate
      .getByRole("spinbutton", { name: "Day" })
      .fill(String(data.sickLeave.startDate.day));
  }
  if (data.sickLeave?.endDate) {
    const endDate = page.getByRole("group", { name: "End date" });
    await endDate
      .getByRole("spinbutton", { name: "Year" })
      .fill(String(data.sickLeave.endDate.year));
    await endDate
      .getByRole("spinbutton", { name: "Month" })
      .fill(String(data.sickLeave.endDate.month));
    await endDate
      .getByRole("spinbutton", { name: "Day" })
      .fill(String(data.sickLeave.endDate.day));
  }
}

// Add a new valid entry through the frontend
export async function addOccupationalEntry(
  page: Page,
  data: OccupationalEntryInput,
  initialEntriesLength: number,
) {
  // Add the new entry
  await fillEntryForm(page, data);
  await page.getByRole("button", { name: "Add", exact: true }).click();

  // Confirm it has been added
  await expect(page.getByRole("alert")).toHaveText(
    "Entry was added successfully!",
  );
  await expect(page.locator(".patient-entry")).toHaveCount(
    initialEntriesLength + 1,
  );
}

// Test adding a new invalid entry with a missing required field
export async function testMissingField(
  page: Page,
  newEntry: OccupationalEntryInput,
  errorMessage: string,
  initialEntriesLength: number,
) {
  // Try to add the patient with the missing field
  await fillEntryForm(page, newEntry);
  await page.getByRole("button", { name: "Add", exact: true }).click();

  // Confirm error message appears on the form
  await expect(page.getByRole("alert")).toHaveText(errorMessage);

  // Confirm no new entry have been added
  await expect(page.locator(".patient-entry")).toHaveCount(
    initialEntriesLength,
  );
}

// Add a new entry directly through a HTTP request to the backend server
export async function postOccupationalRequest(
  id: string,
  request: APIRequestContext,
  newEntry: OccupationalEntryInput,
) {
  const response: APIResponse = await request.post(
    `/api/patients/${id}/entries`,
    {
      data: {
        ...newEntry,
        date: formatDate(newEntry.date),
        sickLeave: {
          startDate: formatDate(newEntry.sickLeave?.startDate),
          endDate: formatDate(newEntry.sickLeave?.endDate),
        },
      },
    },
  );
  expect(response.ok()).toBeTruthy();
}

// Assert a new Occupational Healthcare entry is properly displayed
export async function assertOccupationalEntry(
  entry: Locator,
  data: OccupationalEntryInput,
) {
  await expect(
    entry.locator("p", {
      hasText: `${formatDate(data.date)}`,
    }),
  ).toBeVisible();
  await expect(entry.getByTestId("WorkIcon")).toBeVisible();
  await expect(
    entry.locator("p", { hasText: String(data.description) }),
  ).toBeVisible();
  await expect(
    entry.locator("p", { hasText: String(data.employerName) }),
  ).toBeVisible();
  if (data.diagnosisCodes) {
    await expect(
      entry
        .getByRole("heading", { level: 3 })
        .filter({ hasText: "Diagnoses codes:" }),
    ).toBeVisible();
    for (const code of data.diagnosisCodes) {
      await expect(
        entry.locator("li", { hasText: String(code) }),
      ).toBeVisible();
    }
  }
  if (data.sickLeave) {
    await expect(
      entry
        .getByRole("heading", { level: 3 })
        .filter({ hasText: "Sick leave:" }),
    ).toBeVisible();
    await expect(
      entry.locator("li", {
        hasText: `Start date: ${formatDate(data.sickLeave?.startDate)}`,
      }),
    ).toBeVisible();
    await expect(
      entry.locator("li", {
        hasText: `End date: ${formatDate(data.sickLeave?.endDate)}`,
      }),
    ).toBeVisible();
  }
  await expect(
    entry.locator("em", { hasText: `diagnose by ${data.specialist}` }),
  ).toBeVisible();
}
