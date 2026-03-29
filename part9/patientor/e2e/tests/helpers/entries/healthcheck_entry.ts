// Playwright dependencies
import { expect } from "playwright/test";

// Helper functions
import { formatDate } from "../date_helper";

// TypeScript types
import type { Page, Locator } from "playwright/test";

type HealthCheckEntryInput = {
  description?: unknown;
  date?: {
    year?: unknown;
    month?: unknown;
    day?: unknown;
  };
  specialist?: unknown;
  diagnosisCodes?: unknown[];
  healthCheckRating?: unknown;
};

const ratingValues = {
  0: "Healthy",
  1: "LowRisk",
  2: "HighRisk",
  3: "CriticalRisk",
};

export async function addHealthCheckEntry(
  page: Page,
  data: HealthCheckEntryInput,
) {
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

  await page.getByRole("button", { name: "Add", exact: true }).click();
}

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
