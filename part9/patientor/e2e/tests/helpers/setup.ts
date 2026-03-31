// Playwright dependencies
import { expect } from "@playwright/test";

// Constants
import { newPatient } from "./constants";

// TypeScript types
import type { Page, APIResponse, APIRequestContext } from "playwright/test";
import { formatDate } from "./date_helper";
import { NonSensitivePatient } from "../../../shared/types";

export async function setupTestPatient(
  page: Page,
  request: APIRequestContext,
): Promise<NonSensitivePatient> {
  // Resets the database to the original state before each test
  await page.request.post(`/api/testing/reset`);

  // Add a new patient through the backend server
  const postResponse: APIResponse = await request.post(`/api/patients`, {
    data: { ...newPatient, dateOfBirth: formatDate(newPatient.dateOfBirth) },
  });

  // ensure the request succeeded before proceeding
  expect(postResponse.ok()).toBeTruthy();

  // Navigate to the main page and assert the new patient is present
  await page.goto("/");
  await expect(page.getByText(newPatient.name)).toBeVisible();

  // Returns the newly created patient for any scripts that require it
  const patient = (await postResponse.json()) as NonSensitivePatient;
  return patient;
}
