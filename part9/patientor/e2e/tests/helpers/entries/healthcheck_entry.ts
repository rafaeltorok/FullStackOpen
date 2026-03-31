// Playwright dependencies
import { expect } from "playwright/test";

// Helper functions
import { formatDate } from "../date_helper";

// TypeScript types
import type {
  Page,
  Locator,
  APIResponse,
  APIRequestContext,
} from "playwright/test";
import type { HealthCheckEntryInput } from "../types";

const ratingValues = {
  0: "Healthy",
  1: "LowRisk",
  2: "HighRisk",
  3: "CriticalRisk",
};

// Fill the new entry form
export async function fillEntryForm(page: Page, data: HealthCheckEntryInput) {
  await page.getByRole("button", { name: "Add new entry" }).click();
  await page.getByRole("combobox", { name: "Entry type" }).click();
  await page.getByRole("option", { name: "HealthCheck", exact: true }).click();

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
  if (data.healthCheckRating) {
    await page.getByRole("combobox", { name: "Health Rating" }).click();
    await page
      .getByRole("option", {
        name: ratingValues[data.healthCheckRating as keyof typeof ratingValues],
        exact: true,
      })
      .click();
  }
}

// Add a new valid entry through the frontend
export async function addHealthCheckEntry(
  page: Page,
  data: HealthCheckEntryInput,
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
  newEntry: HealthCheckEntryInput,
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
export async function postHealthCheckRequest(
  id: string,
  request: APIRequestContext,
  newEntry: HealthCheckEntryInput,
) {
  const response: APIResponse = await request.post(
    `/api/patients/${id}/entries`,
    {
      data: {
        ...newEntry,
        date: formatDate(newEntry.date),
      },
    },
  );
  expect(response.ok()).toBeTruthy();
}

// Assert a new HealthCheck entry is properly displayed
export async function assertHealthCheckEntry(
  entry: Locator,
  data: HealthCheckEntryInput,
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
  await expect(entry.getByTestId("FavoriteIcon")).toHaveCSS(
    "color",
    getHealthRatingColor(String(data.healthCheckRating)),
  );
  await expect(
    entry.locator("em", { hasText: `diagnose by ${data.specialist}` }),
  ).toBeVisible();
}

function getHealthRatingColor(rating: string): string {
  switch (rating) {
    case "0":
      return "rgb(0, 255, 0)";
    case "1":
      return "rgb(255, 255, 0)";
    case "2":
      return "rgb(255, 125, 0)";
    case "3":
      return "rgb(255, 0, 0)";
    default:
      return "rgb(0, 0, 0)";
  }
}
