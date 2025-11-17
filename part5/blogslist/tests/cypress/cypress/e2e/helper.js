const resetDatabase = async() => {
  cy.request('POST', 'http://localhost:3003/api/testing/reset')
  cy.visit('http://localhost:5173')
}

const createUser = async (username, name, password) => {
  const user = {
    username: username,
    name: name,
    password: password
  }
  cy.request('POST', 'http://localhost:3003/api/users/', user)
}

const loginWith = async (username, password)  => {
  cy.contains('label', 'Username').type(username)
  cy.contains('label', 'Password').type(password)
  cy.get('#login-button').click()
}

const addBlog = async (title, author, url) => {
  cy.contains('button', 'Add blog').click()
  cy.contains('label', 'Title').type(title)
  cy.contains('label', 'Author').type(author)
  cy.contains('label', 'URL').type(url)
  cy.contains('Submit').click()
}

export { resetDatabase, createUser, loginWith, addBlog }