import { test, expect } from "@playwright/test";

test.describe("Testing the web app home page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173");
  })

  test("Front page can be opened", async ({ page }) => {
    const locator = page.getByText("Patientor");
    await expect(locator).toBeVisible();
    await expect(page.getByText("Patient list")).toBeVisible();
  });

  test("The list of patients is displayed", async ({ page }) => {
    const patients = page.locator("tbody").getByRole("row");
    await expect(patients).toHaveCount(5);
  });
});