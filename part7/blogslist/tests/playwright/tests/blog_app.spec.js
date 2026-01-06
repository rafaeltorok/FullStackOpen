const { test, expect, describe, beforeEach } = require('@playwright/test')
const { resetDatabase, createUser, loginWith, addBlog } = require('./helper.js')

describe('Blogs List app', () => {
  beforeEach(async({ page, request }) => {
    await resetDatabase(page, request)
    await createUser(request, 'admin', 'The Administrator', 'password')
    await page.goto('/')
  })

  test('front page can be opened', async ({ page }) => {
    const heading = page.getByRole('heading', { name: 'Blogs List', level: 1 })
    await expect(heading).toBeVisible()

    const footerLocator = page.locator('footer').getByText('Blogs List app, from the FullStackOpen course by MOOC Finland 2025.')
    await expect(footerLocator).toBeVisible()
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
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
    beforeEach(async({ page }) => {
      await loginWith(page, 'admin', 'password')
    })

    test('user can log in', async ({ page }) => {
      await expect(page.getByText('The Administrator logged in')).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await addBlog(page, 'New blog', 'Playwright', 'http://testing-blogs.com')
      await expect(page.getByText('New blog by Playwright')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await addBlog(page, 'New blog', 'Playwright', 'http://testing-blogs.com')
      await page.getByText('New blog by Playwright').click()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('1')).toBeVisible()
    })

    test('a blog can be deleted', async({ page }) => {
      await addBlog(page, 'New blog', 'Playwright', 'http://testing-blogs.com')

      await page.getByText('New blog by Playwright').click()
      
      page.on('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'delete' }).click()

      await page.getByRole('link', { name: 'home' }).click()

      await expect(
        page.getByRole('listitem', { name: 'New blog by Playwright' })
      ).toHaveCount(0)
    })
  })

  describe('and several blogs exists', () => {
    beforeEach(async({ page }) => {
      await loginWith(page, 'admin', 'password')
      await addBlog(page, 'New blog', 'Playwright', 'http://testing-blogs.com')
      await addBlog(page, 'Another blog', 'Playwright', 'http://testing-blogs.com')
      await addBlog(page, 'One more blog', 'Playwright', 'http://testing-blogs.com')
    })

    test('multiple blogs can be added', async ({ page }) => {
      await expect(page.getByRole('listitem').nth(0)).toContainText('New blog by Playwright')
      await expect(page.getByRole('listitem').nth(1)).toContainText('Another blog by Playwright')
      await expect(page.getByRole('listitem').nth(2)).toContainText('One more blog by Playwright')
    })

    test('each blog contains the name of the user who added it', async ({ page }) => {
      await page.getByText('New blog by Playwright').click()
      let userRow = page.locator('tr', { has: page.locator('th:text("Added by:")') })
      await expect(userRow.locator('td')).toContainText('The Administrator')
      await page.getByRole('link', { name: 'home' }).click()
      
      await page.getByText('Another blog by Playwright').click()
      userRow = page.locator('tr', { has: page.locator('th:text("Added by:")') })
      await expect(userRow.locator('td')).toContainText('The Administrator')
      await page.getByRole('link', { name: 'home' }).click()
      
      await page.getByText('One more blog by Playwright').click()
      userRow = page.locator('tr', { has: page.locator('th:text("Added by:")') })
      await expect(userRow.locator('td')).toContainText('The Administrator')
    })

    test('one of those can be liked', async({ page }) => {
      await page.getByText('Another blog by Playwright').click()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.locator('.like-count')).toContainText('1')
    })

    test('the blogs are ordered by most likes', async({ page }) => {
      // 'Another blog' receives 3 likes
      await page.getByText('Another blog by Playwright').click()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.locator('.like-count')).toHaveText('1')
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.locator('.like-count')).toHaveText('2')
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.locator('.like-count')).toHaveText('3')

      await page.getByRole('link', { name: 'home' }).click()

      // 'One more blog' receives 2 likes
      await page.getByText('One more blog by Playwright').click()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.locator('.like-count')).toHaveText('1')
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.locator('.like-count')).toHaveText('2')

      await page.getByRole('link', { name: 'home' }).click()

      // 'New blog' receives 1 like
      await page.getByText('New blog by Playwright').click()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.locator('.like-count')).toHaveText('1')

      await page.getByRole('link', { name: 'home' }).click()

      // Verify final order: 'Another blog' (3) -> 'One more blog' (2) -> 'New blog' (1)
      await expect(page.getByRole('listitem').nth(0)).toContainText('Another blog by Playwright')
      await expect(page.getByRole('listitem').nth(1)).toContainText('One more blog by Playwright')
      await expect(page.getByRole('listitem').nth(2)).toContainText('New blog by Playwright')
    })
  })

  describe('when there are multiple users', () => {
    beforeEach(async({ page, request }) => {
      await createUser(request, 'test', 'The Tester', 'password')
      await loginWith(page, 'test', 'password')
      await addBlog(page, 'New blog', 'Playwright', 'http://testing-blogs.com')
    })

    test('only the user who created a blog see the delete button', async({ page }) => {
      // First check if the user who added can see the button inside the Blog data table
      await page.getByText('New blog by Playwright').click()
      await expect(page.getByRole('button', { name: 'delete' })).toBeAttached()

      await page.getByRole('link', { name: 'home' }).click()

      // Login as another user to check if the button is not there
      await page.getByRole('button', { name: 'logout' }).click()
      await loginWith(page, 'admin', 'password')

      await page.getByText('New blog by Playwright').click()
      await expect(page.getByRole('button', { name: 'delete' })).not.toBeAttached()
    })
  })

  describe('Testing the comments section', () => {
    beforeEach(async({ page, request }) => {
      await createUser(request, 'test', 'The Tester', 'password')
      await loginWith(page, 'test', 'password')
      await addBlog(page, 'New blog', 'Playwright', 'http://testing-blogs.com')
    })

    test('When there are no comments, a proper message will be displayed', async({ page }) => {
      await page.getByText('New blog by Playwright').click()

      await expect(page.getByText('Comments:')).toBeVisible()
      await expect(page.getByText('No comments')).toBeVisible()
    })

    test('A new comment can be added', async({ page }) => {
      await page.getByText('New blog by Playwright').click()

      await page.getByLabel('Add comment: ').fill('My awesome new comment')
      await page.getByRole('button', { name: 'Add' }).click()

      await expect(page.getByText('Comments:')).toBeVisible()
      await expect(page.getByText('My awesome new comment')).toBeVisible()
    })

    test('An empty comment cannot be added', async({ page }) => {
      await page.getByText('New blog by Playwright').click()

      await page.getByLabel('Add comment: ').fill(' ')
      await page.getByRole('button', { name: 'Add' }).click()

      const errorDiv = page.locator('.error-message')
      await expect(errorDiv).toContainText('Comment cannot be empty')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
      await expect(page.getByText('Comments:')).toBeVisible()
      await expect(page.getByText('No comments')).toBeVisible()
      await expect(page.locator('.comments-section li')).toHaveCount(0)
    })

    test('Multiple comments can be added', async({ page }) => {
      await page.getByText('New blog by Playwright').click()
      const comments = page.locator('.comments-section li')

      await page.getByLabel('Add comment: ').fill('My first comment')
      await page.getByRole('button', { name: 'Add' }).click()
      await expect(comments).toHaveCount(1)
      await page.getByLabel('Add comment: ').fill('My second comment')
      await page.getByRole('button', { name: 'Add' }).click()
      await expect(comments).toHaveCount(2)
      await page.getByLabel('Add comment: ').fill('My third comment')
      await page.getByRole('button', { name: 'Add' }).click()
      await expect(comments).toHaveCount(3)

      await expect(page.getByText('Comments:')).toBeVisible()
      await expect(page.getByText('My first comment')).toBeVisible()
      await expect(page.getByText('My second comment')).toBeVisible()
      await expect(page.getByText('My third comment')).toBeVisible()
    })
  })
})
