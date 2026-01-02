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
      await page.getByRole('button', { name: 'show' }).click()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('1')).toBeVisible()
    })

    test('a blog can be deleted', async({ page }) => {
      await addBlog(page, 'New blog', 'Playwright', 'http://testing-blogs.com')

      const blog = page.getByRole('table').filter({ hasText: 'New blog by Playwright' })
      await blog.getByRole('button', { name: 'show' }).click()
      
      page.on('dialog', dialog => dialog.accept())
      await blog.getByRole('button', { name: 'delete' }).click()

      await expect(blog).not.toBeAttached()
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
      const firstBlog = await page.getByRole('table').nth(0)
      const secondBlog = await page.getByRole('table').nth(1)
      const thirdBlog = await page.getByRole('table').nth(2)

      await expect(firstBlog.locator('thead th')).toContainText('New blog by Playwright')
      await expect(secondBlog.locator('thead th')).toContainText('Another blog by Playwright')
      await expect(thirdBlog.locator('thead th')).toContainText('One more blog by Playwright')
    })

    test('each blog contains the name of the user who added it', async ({ page }) => {
      const firstBlog = page.getByRole('table').nth(0)
      const secondBlog = page.getByRole('table').nth(1)
      const thirdBlog = page.getByRole('table').nth(2)

      await firstBlog.getByRole('button', { name: 'show' }).click()
      let userRow = firstBlog.locator('tr', { has: page.locator('th:text("User:")') })
      await expect(userRow.locator('td')).toContainText('The Administrator')
      
      await secondBlog.getByRole('button', { name: 'show' }).click()
      userRow = secondBlog.locator('tr', { has: page.locator('th:text("User:")') })
      await expect(userRow.locator('td')).toContainText('The Administrator')
      
      await thirdBlog.getByRole('button', { name: 'show' }).click()
      userRow = thirdBlog.locator('tr', { has: page.locator('th:text("User:")') })
      await expect(userRow.locator('td')).toContainText('The Administrator')
    })

    test('one of those can be liked', async({ page }) => {
      const blog = page.getByRole('table').filter({ hasText: 'Another blog by Playwright' })

      await blog.getByRole('button', { name: 'show' }).click()
      await blog.getByRole('button', { name: 'like' }).click()
      await expect(blog.locator('.like-count')).toContainText('1')
    })

    test('the blogs are ordered by most likes', async({ page }) => {
      const firstBlog = page.getByRole('table').filter({ hasText: 'New blog by Playwright' })
      const secondBlog = page.getByRole('table').filter({ hasText: 'Another blog by Playwright' })
      const thirdBlog = page.getByRole('table').filter({ hasText: 'One more blog by Playwright' })

      await firstBlog.getByRole('button', { name: 'show' }).click()
      await secondBlog.getByRole('button', { name: 'show' }).click()
      await thirdBlog.getByRole('button', { name: 'show' }).click()

      // 'Another blog' receives 3 likes
      const secondBlogLikeBtn = secondBlog.getByRole('button', { name: 'like' })
      await secondBlogLikeBtn.click()
      await expect(secondBlog.locator('.like-count')).toHaveText('1')
      await secondBlogLikeBtn.click()
      await expect(secondBlog.locator('.like-count')).toHaveText('2')
      await secondBlogLikeBtn.click()
      await expect(secondBlog.locator('.like-count')).toHaveText('3')

      // 'One more blog' receives 2 likes
      const thirdBlogLikeBtn = thirdBlog.getByRole('button', { name: 'like' })
      await thirdBlogLikeBtn.click()
      await expect(thirdBlog.locator('.like-count')).toHaveText('1')
      await thirdBlogLikeBtn.click()
      await expect(thirdBlog.locator('.like-count')).toHaveText('2')

      // 'New blog' receives 1 like
      await firstBlog.getByRole('button', { name: 'like' }).click()
      await expect(firstBlog.locator('.like-count')).toHaveText('1')

      // Verify final order: 'Another blog' (3) -> 'One more blog' (2) -> 'New blog' (1)
      const anotherBlog = page.getByRole('table').nth(0)
      const oneMoreBlog = page.getByRole('table').nth(1)
      const newBlog = page.getByRole('table').nth(2)

      await expect(anotherBlog.locator('thead th')).toContainText('Another blog by Playwright')
      await expect(oneMoreBlog.locator('thead th')).toContainText('One more blog by Playwright')
      await expect(newBlog.locator('thead th')).toContainText('New blog by Playwright')
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
      const blog = page.getByRole('table').filter({ hasText: 'New blog by Playwright' })
      await blog.getByRole('button', { name: 'show' }).click()
      await expect(blog.getByRole('button', { name: 'delete' })).toBeAttached()

      // Login as another user to check if the button is not there
      await page.getByRole('button', { name: 'logout' }).click()
      await loginWith(page, 'admin', 'password')

      await expect(blog.getByRole('button', { name: 'delete' })).not.toBeAttached()
    })
  })
})
