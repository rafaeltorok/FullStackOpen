const { test, expect, describe, beforeEach } = require('@playwright/test')
const { resetDatabase, loginWith, addBlog } = require('./helper.js')

describe('Blogs List app', () => {
  beforeEach(async({ page }) => {
    await page.goto('/')
  })

  test('front page can be opened', async ({ page }) => {
    const heading = page.getByRole('heading', { name: 'Blogs List', level: 1 })
    await expect(heading).toBeVisible()

    const footerLocator = page.locator('footer').getByText('Blogs List app, from the FullStackOpen course by MOOC Finland 2025.')
    await expect(footerLocator).toBeVisible()
  })

  test('login fails with the wrong password', async({ page, request }) => {
    await resetDatabase(page, request, 'admin', 'The Administrator', 'password')
    await loginWith(page, 'admin', 'wrong')

    const errorDiv = page.locator('.error-message')
    await expect(errorDiv).toContainText('Incorrect credentials')
    await expect(errorDiv).toHaveCSS('border-style', 'solid')
    await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

    await expect(page.getByText('The Administrator logged in')).not.toBeVisible()
  })

  describe('when logged in', () => {
    beforeEach(async({ page, request }) => {
      await resetDatabase(page, request, 'admin', 'The Administrator', 'password')
      await loginWith(page, 'admin', 'password')
      await addBlog(page, 'New blog', 'Playwright', 'http://testing-blogs.com')
    })

    test('user can log in', async ({ page }) => {
      await expect(page.getByText('The Administrator logged in')).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await expect(page.getByText('New blog by Playwright')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await page.getByRole('button', { name: 'show' }).click()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('1')).toBeVisible()
    })
  })
})