import { describe, test, expect, beforeEach } from '@playwright/test';


describe('Routed Anecdotes app', () => {
  beforeEach(async({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('main page can be opened', async ({ page }) => {
    const heading = page.getByRole('heading', { name: 'Software anecdotes', level: 1 })
    await expect(heading).toBeVisible()

    const footer = page.getByText('Anecdote app for Full Stack Open. See https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js for the source code.')
    await expect(footer).toBeVisible()
  })

  test('the anecdotes are rendered on the main page', async ({ page }) => {
    const anecdotes = page.locator('li')
    const firstItem = anecdotes.nth(0)
    const secondItem = anecdotes.nth(1)

    await expect(firstItem).toContainText('If it hurts, do it more often')
    await expect(secondItem).toContainText('Premature optimization is the root of all evil')
    await expect(anecdotes).toHaveCount(2)
  })

  test('clicking on an anecdote displays all info', async ({ page }) => {
    await page.getByRole('link', { name: 'If it hurts, do it more often' }).click()

    await expect(page.getByRole('heading', { name: 'If it hurts, do it more often by Jez Humble', level: 2 })).toBeVisible()
    await expect(page.getByText('has 0 votes')).toBeVisible()
    await expect(page.getByText('for more info see https://martinfowler.com/bliki/FrequencyReducesDifficulty.html')).toBeVisible()
  })

  test('the footer is visible on all pages', async ({ page }) => {
    await expect(page.getByText(
      'Anecdote app for Full Stack Open. See https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js for the source code.'
    )).toBeVisible()

    await page.getByRole('link', { name: 'create new' }).click()
    await expect(page.getByText(
      'Anecdote app for Full Stack Open. See https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js for the source code.'
    )).toBeVisible()

    await page.getByRole('link', { name: 'about' }).click()
    await expect(page.getByText(
      'Anecdote app for Full Stack Open. See https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js for the source code.'
    )).toBeVisible()
  })

  describe('testing the create new form', () => {
    beforeEach(async({ page }) => {
      await page.getByRole('link', { name: 'create new' }).click()
    })

    test('testing the add form', async ({ page }) => {
      await page.getByLabel('content').fill('My first anecdote')
      await page.getByLabel('author').fill('Myself')
      await page.getByLabel('url for more info').fill('http://example.com')
      await page.getByRole('button', { name: 'create' }).click()

      const anecdotes = page.locator('li')
      const firstItem = anecdotes.nth(0)
      const secondItem = anecdotes.nth(1)
      const thirdItem = anecdotes.nth(2)

      await expect(firstItem).toContainText('If it hurts, do it more often')
      await expect(secondItem).toContainText('Premature optimization is the root of all evil')
      await expect(thirdItem).toContainText('My first anecdote')
      await expect(anecdotes).toHaveCount(3)
    })

    test('the reset button clears out all form fields', async ({ page }) => {
      const contentField = page.getByLabel('content')
      contentField.fill('My first anecdote')

      const authorField = page.getByLabel('author')
      authorField.fill('Myself')
      
      const infoField = page.getByLabel('url for more info')
      infoField.fill('http://example.com')

      await page.getByRole('button', { name: 'reset' }).click()

      await expect(contentField).toHaveValue('')
      await expect(authorField).toHaveValue('')
      await expect(infoField).toHaveValue('')
    })

    test('adding a new anecdote displays a notification on the main page', async ({ page }) => {
      await page.getByLabel('content').fill('My first anecdote')
      await page.getByLabel('author').fill('Myself')
      await page.getByLabel('url for more info').fill('http://example.com')
      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByText('a new anecdote My first anecdote created!')).toBeVisible()
    })
  })

  describe('testing the React Router top menu', () => {
    test('can navigate to the create new form', async ({ page }) => {
      await page.getByRole('link', { name: 'create new' }).click()

      const heading = page.getByRole('heading', { name: 'create a new anecdote', level: 2 })
      await expect(heading).toBeVisible()

      await expect(page.getByLabel('content')).toBeVisible()
      await expect(page.getByLabel('author')).toBeVisible()
      await expect(page.getByLabel('url for more info')).toBeVisible()
      await expect(page.getByRole('button', { name: 'create' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'reset' })).toBeVisible()
    })

    test('can navigate to the about section', async ({ page }) => {
      await page.getByRole('link', { name: 'about' }).click()

      const heading = page.getByRole('heading', { name: 'About anecdote app', level: 2 })
      await expect(heading).toBeVisible()
      await expect(page.getByText('According to Wikipedia:')).toBeVisible()
    })

    test('clicking on anecdotes from another menu item sends back to the home page', async ({ page }) => {
      // Navigates to the About section first
      await page.getByRole('link', { name: 'about' }).click()
      await expect(page.getByRole('heading', { name: 'About anecdote app', level: 2 })).toBeVisible()
      
      // Return to the main page
      await page.getByRole('link', { name: 'anecdotes' }).nth(0).click() // Prevents playwright from targeting the Footer link
      await expect(page.getByRole('heading', { name: 'Anecdotes', level: 2 })).toBeVisible()

      // Checks if all anecdotes are present on the main page
      await expect(page.locator('li')).toHaveCount(2)
    })
  })
})