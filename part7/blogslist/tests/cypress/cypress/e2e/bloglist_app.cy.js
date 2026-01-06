describe('Blogs List app', function() {
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
      cy.contains('li', 'My test blog by Cypress').click()
      cy.contains('button', 'delete').should('be.visible')

      cy.contains('button', 'logout').click()
      
      cy.createUser({ username: 'test', name: 'Test user', password: 'test' })
      cy.login({ username: 'test', password: 'test' })

      cy.contains('li', 'My test blog by Cypress').click()
      cy.contains('button', 'delete').should('not.exist')
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
      cy.contains('li', 'My test blog by Cypress').click()

      cy.contains('.blog-title', 'My test blog by Cypress')
      cy.contains('th', 'URL:').next().should('contain', 'https://testing-with-cypress.com')
      cy.contains('th', 'Likes:').next().should('contain', '0')
      cy.contains('th', 'Added by:').next().should('contain', 'The Administrator')
    })

    it('Users can like a blog', function() {
      cy.contains('li', 'My test blog by Cypress').click()

      cy.contains('th', 'Likes:')
        .next()
        .contains('button', 'like')
        .click()
            
      cy.get('.like-count').should('contain', '1')
    })

    it('A blog can be removed', function() {
      cy.contains('li', 'My test blog by Cypress').click()
      
      cy.on('window:confirm', (text) => {
        expect(text).to.contains('Are you sure you want to remove the blog "My test blog" by Cypress from the list?')
        return true // Accept
      })
      cy.contains('button', 'delete').click()

      cy.get('.success-message')
        .should('contain', 'The blog "My test blog" by Cypress was removed from the list')
      cy.contains('li', 'My test blog by Cypress').should('not.exist')
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
      cy.contains('li', 'Another blog by Cypress').click()
      
      cy.contains('button', 'like').click()
      cy.contains('.like-count', '1')
      cy.contains('button', 'like').click()
      cy.contains('.like-count', '2')
      cy.contains('button', 'like').click()
      cy.contains('.like-count', '3')

      cy.contains('a', 'home').click()

      // Like "One more blog" 2 times
      cy.contains('li', 'One more blog by Cypress').click()
      
      cy.contains('button', 'like').click()
      cy.contains('.like-count', '1')
      cy.contains('button', 'like').click()
      cy.contains('.like-count', '2')

      cy.contains('a', 'home').click()

      // Like "New blog" 1 time
      cy.contains('li', 'New blog by Cypress').click()
      
      cy.contains('button', 'like').click()
      cy.contains('.like-count', '1')

      cy.contains('a', 'home').click()

      // Check if the order is correct
      cy.get('.blogs-list li').eq(0).should('contain', 'Another blog')
      cy.get('.blogs-list li').eq(1).should('contain', 'One more blog')
      cy.get('.blogs-list li').eq(2).should('contain', 'New blog')
    })
  })

  describe('Testing the comments section', function() {
    beforeEach(function () {
      cy.login({ username: 'admin', password: 'password' })
      cy.createBlog({
        title: 'New blog',
        author: 'Cypress',
        url: 'https://testing-with-cypress.com'
      })
    })

    it('When there are no comments, a proper message will be displayed', function() {
      cy.contains('li', 'New blog by Cypress').click()

      cy.contains('Comments')
      cy.contains('No comments')
    })

    it('A new comment can be added', function() {
      cy.contains('li', 'New blog by Cypress').click()
      cy.get('#comment-input-field').type('This is a test comment')
      cy.contains('button', 'Add').click()

      cy.get('.success-message')
        .should('contain', 'Comment added')
      cy.contains('Comments')
      cy.contains('This is a test comment')
    })

    it('An empty comment cannot be added', function() {
      cy.contains('li', 'New blog by Cypress').click()
      cy.get('#comment-input-field').type(' ')
      cy.contains('button', 'Add').click()

      cy.get('.error-message')
        .should('contain', 'Comment cannot be empty')
      cy.contains('Comments')
      cy.contains('No comments')
    })

    it('Multiple comments can be added', function() {
      cy.contains('li', 'New blog by Cypress').click()
      
      cy.get('#comment-input-field').type('My first comment')
      cy.contains('button', 'Add').click()
      cy.get('#comment-input-field').type('My second comment')
      cy.contains('button', 'Add').click()
      cy.get('#comment-input-field').type('My third comment')
      cy.contains('button', 'Add').click()

      cy.get('.comments-section li').should('have.length', 3)
      cy.contains('Comments')
      cy.contains('My first comment')
      cy.contains('My second comment')
      cy.contains('My third comment')
    })
  })
})