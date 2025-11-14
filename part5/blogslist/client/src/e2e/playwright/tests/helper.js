const resetDatabase = async(page, request, username, name, password) => {
  await request.post('/api/testing/reset')
  await request.post('/api/users', {
    data: {
      username: username,
      name: name,
      password: password
    }
  })

  await page.goto('/')
}

const loginWith = async (page, username, password)  => {
  await page.getByRole('button', { name: 'login' }).click()
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
}

export { resetDatabase, loginWith, addBlog }