describe('Note app', function() {
  beforeEach(function() {
    cy.resetDatabase()
    cy.createUser({ username: 'admin', name: 'The Administrator', password: 'password' })
  })

  it('Front page can be opened', function() {
    cy.contains('Blogs List')
    cy.contains('Blogs List app, from the FullStackOpen course by MOOC Finland 2025.')
  })

  it('Login form is shown', function() {
    cy.get('#username').should('be.visible')
    cy.get('#password').should('be.visible')
    cy.get('#login-button').should('be.visible')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.login({ username: 'admin', password: 'password' })
      cy.contains('The Administrator logged in')
    })

    it('Login fails with wrong username', function() {
      cy.loginViaUI({ username: 'wrong', password: 'password' })
      cy.get('.error-message')
        .should('contain', 'Incorrect credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html').should('not.contain', 'The Administrator logged in')
    })

    it('Login fails with wrong password', function() {
      cy.loginViaUI({ username: 'admin', password: 'wrong' })
      cy.get('.error-message')
        .should('contain', 'Incorrect credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
      
      cy.get('html').should('not.contain', 'The Administrator logged in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'admin', password: 'password' })
      cy.createBlog({
        title: 'My test blog',
        author: 'Cypress',
        url: 'https://testing-with-cypress.com'
      })
    })

    it('A blog can be created', function() {
      cy.contains('My test blog by Cypress')
    })

    it('Only the user who created a blog can see the delete button', function() {
      cy.contains('.blog-title', 'My test blog by Cypress')
        .closest('table')
        .within(() => {
          cy.contains('button', 'show').click()
          cy.contains('button', 'delete').should('be.visible')
        })

      cy.contains('button', 'logout').click()
      
      cy.createUser({ username: 'test', name: 'Test user', password: 'test' })
      cy.login({ username: 'test', password: 'test' })

      cy.contains('.blog-title', 'My test blog by Cypress')
        .closest('table')
        .within(() => {
          cy.contains('button', 'show').click()
          cy.contains('button', 'delete').should('not.exist')
        })
    })
  })

  describe('And a blog exists', function () {
    beforeEach(function () {
      cy.login({ username: 'admin', password: 'password' })
      cy.createBlog({
        title: 'My test blog',
        author: 'Cypress',
        url: 'https://testing-with-cypress.com'
      })
    })

    it('The blog details can be shown', function () {
      cy.contains('.blog-title', 'My test blog by Cypress')
        .closest('table')
        .within(() => {
          cy.contains('button', 'show').click()
          
          cy.contains('th', 'URL:').next().should('contain', 'https://testing-with-cypress.com')
          cy.contains('th', 'Likes:').next().should('contain', '0')
          cy.contains('th', 'User:').next().should('contain', 'The Administrator')
        })
    })

    it('Users can like a blog', function() {
      cy.contains('.blog-title', 'My test blog by Cypress')
        .closest('table')
        .within(() => {
          cy.contains('button', 'show').click()

          cy.contains('th', 'Likes:')
            .next()
            .contains('button', 'like')
            .click()
            
          cy.get('.like-count').should('contain', '1')
        })
    })

    it('A blog can be removed', function() {
      cy.contains('.blog-title', 'My test blog by Cypress')
        .closest('table')
        .within(() => {
          cy.contains('button', 'show').click()
          cy.on('window:confirm', (text) => {
            expect(text).to.contains('Are you sure you want to remove the blog "My test blog" by Cypress from the list?')
            return true // Accept
          })
          cy.contains('button', 'delete').click()
        })

      cy.contains('.blog-title', 'My test blog by Cypress').should('not.exist')
    })
  })

  describe('And multiple blogs exists', function() {
    beforeEach(function () {
      cy.login({ username: 'admin', password: 'password' })
      cy.createBlog({
        title: 'New blog',
        author: 'Cypress',
        url: 'https://testing-with-cypress.com'
      })
      cy.createBlog({
        title: 'Another blog',
        author: 'Cypress',
        url: 'https://testing-with-cypress.com'
      })
      cy.createBlog({
        title: 'One more blog',
        author: 'Cypress',
        url: 'https://testing-with-cypress.com'
      })
    })

    it('Blogs are ordered by the number of likes', function() {
      // Like "Another blog" 3 times
      cy.contains('.blog-title', 'Another blog by Cypress')
        .closest('table')
        .as('anotherBlog')
      
      cy.get('@anotherBlog').contains('button', 'show').click()
      cy.get('@anotherBlog').contains('button', 'like').click()
      cy.get('@anotherBlog').contains('.like-count', '1')
      cy.get('@anotherBlog').contains('button', 'like').click()
      cy.get('@anotherBlog').contains('.like-count', '2')
      cy.get('@anotherBlog').contains('button', 'like').click()
      cy.get('@anotherBlog').contains('.like-count', '3')

      // Like "One more blog" 2 times
      cy.contains('.blog-title', 'One more blog by Cypress')
        .closest('table')
        .as('oneMoreBlog')
      
      cy.get('@oneMoreBlog').contains('button', 'show').click()
      cy.get('@oneMoreBlog').contains('button', 'like').click()
      cy.get('@oneMoreBlog').contains('.like-count', '1')
      cy.get('@oneMoreBlog').contains('button', 'like').click()
      cy.get('@oneMoreBlog').contains('.like-count', '2')

      // Like "New blog" 1 time
      cy.contains('.blog-title', 'New blog by Cypress')
        .closest('table')
        .as('newBlog')
      
      cy.get('@newBlog').contains('button', 'show').click()
      cy.get('@newBlog').contains('button', 'like').click()
      cy.get('@newBlog').contains('.like-count', '1')

      // Check if the order is correct
      cy.get('.blog').eq(0).should('contain', 'Another blog')
      cy.get('.blog').eq(1).should('contain', 'One more blog')
      cy.get('.blog').eq(2).should('contain', 'New blog')
    })
  })
})