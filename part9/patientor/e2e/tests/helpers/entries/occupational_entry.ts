// Playwright dependencies
import { expect } from "playwright/test";

// TypeScript types
import type { Page, Locator, APIResponse, APIRequestContext } from "playwright/test";

// Helper functions
import { formatDate } from "../date_helper";

type OccupationalEntryInput = {
  description?: unknown;
  date?: {
    year?: unknown;
    month?: unknown;
    day?: unknown;
  };
  specialist?: unknown;
  employerName?: unknown;
  diagnosisCodes?: unknown[];
  sickLeave?: {
    startDate?: {
      year?: unknown;
      month?: unknown;
      day?: unknown;
    };
    endDate?: {
      year?: unknown;
      month?: unknown;
      day?: unknown;
    };
  };
};

// Adds a new entry through the frontend
export async function addOccupationalEntry(
  page: Page,
  data: OccupationalEntryInput,
) {
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
    const startDate = page.getByRole("group", { name: "End date" });
    await startDate
      .getByRole("spinbutton", { name: "Year" })
      .fill(String(data.sickLeave.endDate.year));
    await startDate
      .getByRole("spinbutton", { name: "Month" })
      .fill(String(data.sickLeave.endDate.month));
    await startDate
      .getByRole("spinbutton", { name: "Day" })
      .fill(String(data.sickLeave.endDate.day));
  }

  await page.getByRole("button", { name: "Add", exact: true }).click();
}

// Adds a new entry directly through a HTTP request to the backend server
export async function postOccupationalRequest(id: string, request: APIRequestContext, newEntry: OccupationalEntryInput) {
  const response: APIResponse = await request.post(`/api/patients/${id}/entries`, {
    data: {
      ...newEntry,
      date: formatDate(newEntry.date),
      sickLeave: {
        startDate: formatDate(newEntry.sickLeave?.startDate),
        endDate: formatDate(newEntry.sickLeave?.endDate),
      },
    },
  });
  expect(response.ok()).toBeTruthy();
}

export async function assertOccupationalEntry(
  entry: Locator,
  data: OccupationalEntryInput,
) {
  await expect(
    entry.locator("p", {
      hasText: `${data.date?.year}-${data.date?.month}-${data.date?.day}`,
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
