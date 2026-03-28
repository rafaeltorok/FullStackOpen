// Playwright dependencies
import { test, expect } from "@playwright/test";

// URLs
const serverUrl = "http://localhost:3001";
const clientUrl = "http://localhost:5173";

// Helper functions
import { addPatient } from "./helpers/addPatient";

// TypeScript types
import { HealthCheckRating, type NonSensitivePatient } from '../../shared/types';

// E2E tests
test.beforeEach(async ({ page }) => {
  // Resets the database to the original state before each test
  await page.request.post(`${serverUrl}/api/testing/reset`);
  // Navigate to the home page
  await page.goto(clientUrl);
});

test.describe("Testing the web app home page", () => {
  test("Front page can be opened", async ({ page }) => {
    // Checks the main page title
    await expect(page).toHaveTitle(/Patientor/);
    // Checks if the sub-title is present
    const locator = page.getByText("Patient list");
    await expect(locator).toBeVisible();
  });

  test("should display the list of patients", async ({ page }) => {
    const patients = page.locator("tbody").getByRole("row");
    await expect(patients).toHaveCount(5);
  });

  test("should display a patients' non-sensitive information", async ({ page }) => {
    const row = page
      .locator('tbody')
      .getByRole('row')
      .filter({ has: page.getByRole('link', { name: 'John McClane' }) });
    await expect(row.getByRole('link', { name: 'John McClane' })).toBeVisible();
    await expect(row.getByRole('cell', { name: 'male' })).toBeVisible();
    await expect(row.getByRole('cell', { name: 'New york city cop' })).toBeVisible();
  });
});

test.describe("Testing the add new patient form", () => {
  test("should display the form when clicking on the Add New Patient button", async ({ page }) => {
    await page.getByRole('button', { name: "Add New Patient" }).click();
    await expect(page.getByLabel('Name')).toBeVisible();
    await expect(page.getByLabel('Social security number')).toBeVisible();
    await expect(page.getByRole('group', { name: 'Date of birth' })).toBeVisible();
    await expect(page.getByLabel('Occupation')).toBeVisible();
    await expect(page.locator('label').filter({ hasText: 'Gender' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add' })).toBeVisible();
  });

  test("should add a new patient when clicking on the Add button", async ({ page }) => {
    // wait for the expected initial data to be present first
    await expect(page.locator("tbody").getByRole("row")).toHaveCount(5);
    const initialPatientsLength = await page.locator("tbody").getByRole("row").count();

    const patientData = {
      name: "John Johns",
      ssn: "01-010101",
      dateOfBirth: {
        year: 1980,
        month: 1,
        day: 1
      },
      occupation: "Developer",
      gender: 'male'
    };
    await addPatient(page, patientData);

    const patients = page.locator("tbody").getByRole("row");
    await expect(patients).toHaveCount(initialPatientsLength + 1);

    const row = page
      .locator('tbody')
      .getByRole('row')
      .filter({ has: page.getByRole('link', { name: 'John Johns' }) });
    await expect(row.getByRole('link', { name: 'John Johns' })).toBeVisible();
    await expect(row.getByRole('cell', { name: 'male' })).toBeVisible();
    await expect(row.getByRole('cell', { name: 'Developer' })).toBeVisible();
  });

  test("the cancel button should not add a new patient", async ({ page }) => {
    await expect(page.locator("tbody").getByRole("row")).toHaveCount(5);
    const initialPatientsLength = await page.locator("tbody").getByRole("row").count();

    await page.getByRole('button', { name: "Add New Patient" }).click();
    await page.getByRole('textbox', { name: 'Name' }).fill("John Johns");
    await page.getByRole('textbox', { name: 'Social security number' }).fill("01-010101");
    const dateGroup = page.getByRole('group', { name: 'Date of birth' });
    await dateGroup.getByRole('spinbutton', { name: 'Year' }).fill("1980");
    await dateGroup.getByRole('spinbutton', { name: 'Month' }).fill("01");
    await dateGroup.getByRole('spinbutton', { name: 'Day' }).fill("01");
    await page.getByRole('textbox', { name: 'Occupation' }).fill("Developer");
    await page
      .getByText('Gender')
      .locator('..')
      .getByRole('combobox')
      .click();
    await page.getByRole('option', { name: "male", exact: true }).click();

    await page.getByRole('button', { name: 'Cancel' }).click();

    const patients = page.locator("tbody").getByRole("row");
    await expect(patients).toHaveCount(initialPatientsLength);

    await expect(page
      .locator('tbody')
      .getByRole('row')
      .filter({ has: page.getByRole('link', { name: 'John Johns' }) }))
      .toHaveCount(0);
  });

  test("missing the name field", async ({ page }) => {
    await expect(page.locator("tbody").getByRole("row")).toHaveCount(5);
    const initialPatientsLength = await page.locator("tbody").getByRole("row").count();

    const patientData = {
      ssn: "01-010101",
      dateOfBirth: {
        year: 1980,
        month: 1,
        day: 1
      },
      occupation: "Developer",
      gender: 'male'
    };
    await addPatient(page, patientData);

    await expect(page.getByRole("alert")).toHaveText("Patient name is required");

    await page.getByRole('button', { name: 'Cancel' }).click();

    const patients = page.locator("tbody").getByRole("row");
    await expect(patients).toHaveCount(initialPatientsLength);

    await expect(page
      .locator('tbody')
      .getByRole('row')
      .filter({ has: page.getByRole('link', { name: 'John Johns' }) }))
      .toHaveCount(0);
  });

  test("missing the ssn field", async ({ page }) => {
    await expect(page.locator("tbody").getByRole("row")).toHaveCount(5);
    const initialPatientsLength = await page.locator("tbody").getByRole("row").count();

    const patientData = {
      name: "John Johns",
      dateOfBirth: {
        year: 1980,
        month: 1,
        day: 1
      },
      occupation: "Developer",
      gender: 'male'
    };
    await addPatient(page, patientData);

    await expect(page.getByRole("alert")).toHaveText("Patient SSN is required");

    await page.getByRole('button', { name: 'Cancel' }).click();

    const patients = page.locator("tbody").getByRole("row");
    await expect(patients).toHaveCount(initialPatientsLength);

    await expect(page
      .locator('tbody')
      .getByRole('row')
      .filter({ has: page.getByRole('link', { name: 'John Johns' }) }))
      .toHaveCount(0);
  });

  test("missing the date of birth field", async ({ page }) => {
    await expect(page.locator("tbody").getByRole("row")).toHaveCount(5);
    const initialPatientsLength = await page.locator("tbody").getByRole("row").count();

    const patientData = {
      name: "John Johns",
      ssn: "01-010101",
      occupation: "Developer",
      gender: 'male'
    };
    await addPatient(page, patientData);

    await expect(page.getByRole("alert")).toHaveText("Invalid ISO date");

    await page.getByRole('button', { name: 'Cancel' }).click();

    const patients = page.locator("tbody").getByRole("row");
    await expect(patients).toHaveCount(initialPatientsLength);

    await expect(page
      .locator('tbody')
      .getByRole('row')
      .filter({ has: page.getByRole('link', { name: 'John Johns' }) }))
      .toHaveCount(0);
  });

  test("missing the year on the date of birth field", async ({ page }) => {
    await expect(page.locator("tbody").getByRole("row")).toHaveCount(5);
    const initialPatientsLength = await page.locator("tbody").getByRole("row").count();

    const patientData = {
      name: "John Johns",
      ssn: "01-010101",
      dateOfBirth: {
        month: 1,
        day: 1
      },
      occupation: "Developer",
      gender: 'male'
    };
    await addPatient(page, patientData);

    await expect(page.getByRole("alert")).toHaveText("Invalid ISO date");

    await page.getByRole('button', { name: 'Cancel' }).click();

    const patients = page.locator("tbody").getByRole("row");
    await expect(patients).toHaveCount(initialPatientsLength);

    await expect(page
      .locator('tbody')
      .getByRole('row')
      .filter({ has: page.getByRole('link', { name: 'John Johns' }) }))
      .toHaveCount(0);
  });

  test("missing the month on the date of birth field", async ({ page }) => {
    await expect(page.locator("tbody").getByRole("row")).toHaveCount(5);
    const initialPatientsLength = await page.locator("tbody").getByRole("row").count();

    const patientData = {
      name: "John Johns",
      ssn: "01-010101",
      dateOfBirth: {
        year: 1980,
        day: 1
      },
      occupation: "Developer",
      gender: 'male'
    };
    await addPatient(page, patientData);

    await expect(page.getByRole("alert")).toHaveText("Invalid ISO date");

    await page.getByRole('button', { name: 'Cancel' }).click();

    const patients = page.locator("tbody").getByRole("row");
    await expect(patients).toHaveCount(initialPatientsLength);

    await expect(page
      .locator('tbody')
      .getByRole('row')
      .filter({ has: page.getByRole('link', { name: 'John Johns' }) }))
      .toHaveCount(0);
  });

  test("missing the day on the date of birth field", async ({ page }) => {
    await expect(page.locator("tbody").getByRole("row")).toHaveCount(5);
    const initialPatientsLength = await page.locator("tbody").getByRole("row").count();

    const patientData = {
      name: "John Johns",
      ssn: "01-010101",
      dateOfBirth: {
        year: 1980,
        month: 1,
      },
      occupation: "Developer",
      gender: 'male'
    };
    await addPatient(page, patientData);

    await expect(page.getByRole("alert")).toHaveText("Invalid ISO date");

    await page.getByRole('button', { name: 'Cancel' }).click();

    const patients = page.locator("tbody").getByRole("row");
    await expect(patients).toHaveCount(initialPatientsLength);

    await expect(page
      .locator('tbody')
      .getByRole('row')
      .filter({ has: page.getByRole('link', { name: 'John Johns' }) }))
      .toHaveCount(0);
  });

  test("missing the occupation field", async ({ page }) => {
    await expect(page.locator("tbody").getByRole("row")).toHaveCount(5);
    const initialPatientsLength = await page.locator("tbody").getByRole("row").count();
    
    const patientData = {
      name: "John Johns",
      ssn: "01-010101",
      dateOfBirth: {
        year: 1980,
        month: 1,
        day: 1
      },
      gender: 'male'
    };
    await addPatient(page, patientData);

    await expect(page.getByRole("alert")).toHaveText("Patient occupation is required");

    await page.getByRole('button', { name: 'Cancel' }).click();

    const patients = page.locator("tbody").getByRole("row");
    await expect(patients).toHaveCount(initialPatientsLength);

    await expect(page
      .locator('tbody')
      .getByRole('row')
      .filter({ has: page.getByRole('link', { name: 'John Johns' }) }))
      .toHaveCount(0);
  });
});

test.describe("Patient full info page", () => {
  test.beforeEach(async ({ page, request }) => {
    await page.request.post(`${serverUrl}/api/testing/reset`);

    const postResponse = await request.post(`${serverUrl}/api/patients`, {
      data: {
        name: 'John Johns',
        ssn: '090786-122X',
        dateOfBirth: '1980-01-01',
        occupation: 'Developer',
        gender: 'male'
      }
    });

    // ensure the request succeeded before proceeding
    expect(postResponse.ok()).toBeTruthy();

    const patient = (await postResponse.json()) as NonSensitivePatient;

    // Adds a new Hospital entry
    await request.post(`${serverUrl}/api/patients/${patient.id}/entries`, {
      data: {
        type: "Hospital",
        date: "2025-12-31",
        specialist: "Doctor Tester",
        diagnosisCodes: [
          "S62.5"
        ],
        description: "Stable condition.",
        discharge: {
          "date": "2026-01-03",
          "criteria": "Patient has healed."
        }
      }
    });

    // Adds a new HealthCheck entry
    await request.post(`${serverUrl}/api/patients/${patient.id}/entries`, {
      data: {
        type: "HealthCheck",
        date: "2026-01-20",
        specialist: "Doctor Tester",
        diagnosisCodes: [
          "J10.1"
        ],
        description: "Patient showing classic flu symptoms.",
        healthCheckRating: 1
      }
    });

    // Adds a new OccupationalHealthcare entry
    await request.post(`${serverUrl}/api/patients/${patient.id}/entries`, {
      data: {
        type: "OccupationalHealthcare",
        date: "2026-02-15",
        specialist: "Doctor Tester",
        diagnosisCodes: [
          "M51.2"
        ],
        description: "Patient is having recurring back pains.",
        employerName: "Company",
        sickLeave: {
          "startDate": "2026-02-15",
          "endDate": "2026-03-02"
        }
      }
    });

    await page.goto(clientUrl);
    await expect(page.getByText('John Johns')).toBeVisible();
  });

  test("clicking on a patient's name should display all information", async ({ page }) => {
    await page
      .locator('tbody')
      .getByRole('link', { name: 'John Johns' }).click();

    await expect(page.getByRole('heading', { level: 2 })).toHaveText("John Johns");
    await expect(page.getByTestId('MaleIcon')).toBeVisible();
    await expect(page.locator('p', { hasText: 'ssn: 090786-122X' })).toBeVisible();
    await expect(page.locator('p', { hasText: 'occupation: Developer' })).toBeVisible();
  });

  test("should display the list of entries if a patient has any", async ({ page }) => {
    await page
      .locator('tbody')
      .getByRole('link', { name: 'John Johns' }).click();

    await expect(page.getByRole('heading', { level: 3 }).filter({ hasText: 'Entries' })).toContainText('(3 total)');
    const entries = page.locator(".patient-entry");
    await expect(entries).toHaveCount(3);
  });

  test("a Hospital entry should be properly displayed", async ({ page }) => {
    await page
      .locator('tbody')
      .getByRole('link', { name: 'John Johns' }).click();

    const entries = page.locator(".patient-entry");
    await expect(entries.nth(0).locator('p', { hasText: '2025-12-31'})).toBeVisible();
    await expect(entries.nth(0).getByTestId('LocalHospitalIcon')).toBeVisible();
    await expect(entries.nth(0).locator('p', { hasText: "Stable condition."})).toBeVisible();
    await expect(entries.nth(0).getByRole('heading', { level: 3 }).filter({ hasText: 'Discharge:'})).toBeVisible();
    await expect(entries.nth(0).locator('li', { hasText: 'Date: 2026-01-03'})).toBeVisible();
    await expect(entries.nth(0).locator('li', { hasText: 'Criteria: Patient has healed.'})).toBeVisible();
    await expect(entries.nth(0).locator('em', { hasText: 'diagnose by Doctor Tester'})).toBeVisible();
  });

  test("a HealthCheck entry should be properly displayed", async ({ page }) => {
    await page
      .locator('tbody')
      .getByRole('link', { name: 'John Johns' }).click();

    const entries = page.locator(".patient-entry");
    await expect(entries.nth(1).locator('p', { hasText: '2026-01-20'})).toBeVisible();
    await expect(entries.nth(1).getByTestId('LocalHospitalIcon')).toBeVisible();
    await expect(entries.nth(1).getByTestId('FavoriteIcon')).toHaveCSS('color', "rgb(255, 255, 0)");
    await expect(entries.nth(1).locator('p', { hasText: "Patient showing classic flu symptoms."})).toBeVisible();
    await expect(entries.nth(1).locator('em', { hasText: 'diagnose by Doctor Tester'})).toBeVisible();
  });

  test("an Occupational Healthcare entry should be properly displayed", async ({ page }) => {
    await page
      .locator('tbody')
      .getByRole('link', { name: 'John Johns' }).click();

    const entries = page.locator(".patient-entry");
    await expect(entries.nth(2).locator('p', { hasText: '2026-02-15'})).toBeVisible();
    await expect(entries.nth(2).getByTestId('WorkIcon')).toBeVisible();
    await expect(entries.nth(2).locator('p', { hasText: "Patient is having recurring back pains."})).toBeVisible();
    await expect(entries.nth(2).locator('p', { hasText: "Company"})).toBeVisible();
    await expect(entries.nth(2).getByRole('heading', { level: 3 }).filter({ hasText: 'Sick Leave:'})).toBeVisible();
    await expect(entries.nth(2).locator('li', { hasText: 'Start date: 2026-02-15'})).toBeVisible();
    await expect(entries.nth(2).locator('li', { hasText: 'End date: 2026-03-02'})).toBeVisible();
    await expect(entries.nth(2).locator('em', { hasText: 'diagnose by Doctor Tester'})).toBeVisible();
  });

  test("the home button should return to the main patient list", async ({ page }) => {
    await page
      .locator('tbody')
      .getByRole('link', { name: 'John Johns' }).click();

    await expect(page.getByRole('heading', { level: 2 })).toHaveText("John Johns");

    await page.getByRole('link', { name: "Home" }).click();

    await expect(page).toHaveTitle(/Patientor/);
    await expect(page.getByText("Patient list")).toBeVisible();
    const patients = page.locator("tbody").getByRole("row");
    await expect(patients).toHaveCount(6);
  });
});

test.describe("Adding new entries", () => {
  test.beforeEach(async ({ page, request }) => {
    await page.request.post(`${serverUrl}/api/testing/reset`);

    const postResponse = await request.post(`${serverUrl}/api/patients`, {
      data: {
        name: 'John Johns',
        ssn: '090786-122X',
        dateOfBirth: '1980-01-01',
        occupation: 'Developer',
        gender: 'male'
      }
    });

    // ensure the request succeeded before proceeding
    expect(postResponse.ok()).toBeTruthy();

    await page.goto(clientUrl);
    await expect(page.getByText('John Johns')).toBeVisible();
  });

  test("the add new entry button should display a form", async ({ page }) => {
    await page
      .locator('tbody')
      .getByRole('link', { name: 'John Johns' }).click();

    await expect(page.getByRole('heading', { level: 2 })).toHaveText("John Johns");

    await page.getByRole('button', { name: 'Add new entry' }).click();

    await expect(page.locator('label').filter({ hasText: 'Entry type' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Description' })).toBeVisible();
    await expect(page.getByRole('group', { name: 'Date' }).first()).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Specialist' })).toBeVisible();
    await expect(page.getByText('Diagnosis code')).toBeVisible();
    await expect(page.locator('form').filter({ hasText: 'DescriptionDescriptionDateMM/' }).getByRole('combobox')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add Diagnose' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel', exact: true })).toBeVisible();
  });

  test("the cancel button should hide the entry form", async ({ page }) => {
    await page
      .locator('tbody')
      .getByRole('link', { name: 'John Johns' }).click();

    await expect(page.getByRole('heading', { level: 2 })).toHaveText("John Johns");

    await page.getByRole('button', { name: 'Add new entry' }).click();

    // Confirms the form is displayed
    await expect(page.locator('label').filter({ hasText: 'Entry type' })).toBeVisible();

    // Confirms the Cancel button exists and can be clicked on
    const cancelButton = page.getByRole('button', { name: 'Cancel', exact: true });
    await expect(cancelButton).toBeVisible();
    await cancelButton.click();

    // Checks if the form has been truly hidden
    await expect(page.getByRole('button', { name: 'Add new entry' })).toBeVisible();
    await expect(page.locator('label').filter({ hasText: 'Entry type' })).toBeHidden();
  });

  test("should display all fields for a new Hospital entry", async ({ page }) => {
    await page
      .locator('tbody')
      .getByRole('link', { name: 'John Johns' }).click();

    await expect(page.getByRole('heading', { level: 2 })).toHaveText("John Johns");

    await page.getByRole('button', { name: 'Add new entry' }).click();

    await page
      .getByText('Entry type')
      .locator('..')
      .getByRole('combobox')
      .click();
    await page.getByRole('option', { name: "Hospital", exact: true }).click();

    await expect(page.locator('label').filter({ hasText: 'Entry type' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Description' })).toBeVisible();
    await expect(page.getByRole('group', { name: 'Date' }).first()).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Specialist' })).toBeVisible();
    await expect(page.getByText('Diagnosis code')).toBeVisible();
    await expect(page.getByText('Diagnosis code').locator('..').getByRole('combobox')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add Diagnose' })).toBeVisible();
    await expect(page.getByText('Discharge')).toBeVisible();
    await expect(page.getByRole('group', { name: 'Date' }).nth(1)).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Criteria' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add', exact: true })).toBeVisible();
  });

  test("should display all fields for a new HealthCheck entry", async ({ page }) => {
    await page
      .locator('tbody')
      .getByRole('link', { name: 'John Johns' }).click();

    await expect(page.getByRole('heading', { level: 2 })).toHaveText("John Johns");

    await page.getByRole('button', { name: 'Add new entry' }).click();

    await page.getByRole('combobox').first().click();
    await page.getByRole('option', { name: "HealthCheck", exact: true }).click();

    await expect(page.locator('label').filter({ hasText: 'Entry type' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Description' })).toBeVisible();
    await expect(page.getByRole('group', { name: 'Date' }).first()).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Specialist' })).toBeVisible();
    await expect(page.getByText('Diagnosis code')).toBeVisible();
    await expect(page.getByText('Diagnosis code').locator('..').getByRole('combobox')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add Diagnose' })).toBeVisible();
    await expect(page.locator('label').filter({ hasText: 'Health Rating' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add', exact: true })).toBeVisible();
  });
});