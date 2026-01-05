const resetDatabase = async(page, request) => {
  await request.post('/api/testing/reset')
  await page.goto('/')
}

const createUser = async(request, username, name, password) => {
  await request.post('/api/users', {
    data: {
      username: username,
      name: name,
      password: password
    }
  })
}

const loginWith = async (page, username, password)  => {
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const addBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'Add blog' }).click()
  await page.getByLabel('Title').fill(title)
  await page.getByLabel('Author').fill(author)
  await page.getByLabel('URL').fill(url)
  await page.getByRole('button', { name: 'Submit' }).click()
  await page.getByText(`${title} by ${author}`).waitFor()  // Prevents flaky tests on Firefox
}

export { resetDatabase, createUser, loginWith, addBlog }