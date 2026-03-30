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

type HospitalEntryInput = {
  description?: unknown;
  date?: {
    year?: unknown;
    month?: unknown;
    day?: unknown;
  };
  specialist?: unknown;
  diagnosisCodes?: unknown[];
  discharge?: {
    date?: {
      year?: unknown;
      month?: unknown;
      day?: unknown;
    };
    criteria?: unknown;
  };
};

// Fill the new entry form
export async function fillEntryForm(page: Page, data: HospitalEntryInput) {
  await page.getByRole("button", { name: "Add new entry" }).click();
  await page.getByRole("combobox", { name: "Entry type" }).click();
  await page.getByRole("option", { name: "Hospital", exact: true }).click();

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
  if (data.discharge?.date) {
    const dischargeDate = page.getByRole("group", { name: "Date" }).nth(1);
    await dischargeDate
      .getByRole("spinbutton", { name: "Year" })
      .fill(String(data.discharge.date.year));
    await dischargeDate
      .getByRole("spinbutton", { name: "Month" })
      .fill(String(data.discharge.date.month));
    await dischargeDate
      .getByRole("spinbutton", { name: "Day" })
      .fill(String(data.discharge.date.day));
  }
  if (data.discharge?.criteria) {
    await page
      .getByRole("textbox", { name: "Criteria" })
      .fill(String(data.discharge.criteria));
  }
}

// Add a new valid entry through the frontend
export async function addHospitalEntry(
  page: Page,
  data: HospitalEntryInput,
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

// Tests adding a new entry with a missing field
export async function testMissingField(
  page: Page,
  newEntry: HospitalEntryInput,
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

// Adds a new entry directly through a HTTP request to the backend server
export async function postHospitalRequest(
  id: string,
  request: APIRequestContext,
  newEntry: HospitalEntryInput,
) {
  const response: APIResponse = await request.post(
    `/api/patients/${id}/entries`,
    {
      data: {
        ...newEntry,
        date: formatDate(newEntry.date),
        discharge: {
          ...newEntry.discharge,
          date: formatDate(newEntry.discharge?.date),
        },
      },
    },
  );
  expect(response.ok()).toBeTruthy();
}

export async function assertHospitalEntry(
  entry: Locator,
  data: HospitalEntryInput,
) {
  await expect(
    entry.locator("p", {
      hasText: `${formatDate(data.date)}`,
    }),
  ).toBeVisible();
  await expect(entry.getByTestId("LocalHospitalIcon")).toBeVisible();
  await expect(
    entry.locator("p", { hasText: String(data.description) }),
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
  await expect(
    entry.getByRole("heading", { level: 3 }).filter({ hasText: "Discharge:" }),
  ).toBeVisible();
  await expect(
    entry.locator("li", {
      hasText: `Date: ${formatDate(data.discharge?.date)}`,
    }),
  ).toBeVisible();
  await expect(
    entry.locator("li", { hasText: `Criteria: ${data.discharge?.criteria}` }),
  ).toBeVisible();
  await expect(
    entry.locator("em", { hasText: `diagnose by ${data.specialist}` }),
  ).toBeVisible();
}
