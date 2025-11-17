describe('Note app', function() {
  beforeEach(function() {
    cy.resetDatabase()
    cy.createUser({ username: 'admin', name: 'The Administrator', password: 'password' })
  })

  it('front page can be opened', function() {
    cy.contains('Blogs List')
    cy.contains('Blogs List app, from the FullStackOpen course by MOOC Finland 2025.')
  })
  
  it('user can login', function() {
    cy.login({ username: 'admin', password: 'password' })
    cy.contains('The Administrator logged in')
  })

  it('login fails with wrong username', function() {
    cy.loginViaUI({ username: 'wrong', password: 'password' })
    cy.get('.error-message')
      .should('contain', 'Incorrect credentials')
      .and('have.css', 'color', 'rgb(255, 0, 0)')
      .and('have.css', 'border-style', 'solid')

    cy.get('html').should('not.contain', 'The Administrator logged in')
  })

  it('login fails with wrong password', function() {
    cy.loginViaUI({ username: 'admin', password: 'wrong' })
    cy.get('.error-message')
      .should('contain', 'Incorrect credentials')
      .and('have.css', 'color', 'rgb(255, 0, 0)')
      .and('have.css', 'border-style', 'solid')
    
    cy.get('html').should('not.contain', 'The Administrator logged in')
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'admin', password: 'password' })
    })

    it('testing the add blog form', function() {
      cy.createBlog({
        title: 'My test blog',
        author: 'Cypress',
        url: 'https://testing-with-cypress.com'
      })
      cy.contains('My test blog by Cypress')
    })
  })

  describe('and a blog exists', function () {
    beforeEach(function () {
      cy.login({ username: 'admin', password: 'password' })
      cy.createBlog({
        title: 'My test blog',
        author: 'Cypress',
        url: 'https://testing-with-cypress.com'
      })
    })

    it('the blog details can be shown', function () {
      cy.contains('.blog-title', 'My test blog by Cypress')
        .closest('table')
        .within(() => {
          cy.contains('button', 'show').click()
          
          cy.contains('th', 'URL:').next().should('contain', 'https://testing-with-cypress.com')
          cy.contains('th', 'Likes:').next().should('contain', '0')
          cy.contains('th', 'User:').next().should('contain', 'The Administrator')
        })
    })
  })
})