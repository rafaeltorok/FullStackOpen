import { resetDatabase, createUser, loginWith, addBlog } from "./helper"

describe('Note app', function() {
  beforeEach(function() {
    resetDatabase()
    createUser('admin', 'The Administrator', 'password')
  })

  it('front page can be opened', function() {
    cy.contains('Blogs List')
    cy.contains('Blogs List app, from the FullStackOpen course by MOOC Finland 2025.')
  })
  
  it('user can login', function() {
    loginWith('admin', 'password')
    cy.contains('The Administrator logged in')
  })

  describe('when logged in', function() {
    beforeEach(function() {
      loginWith('admin', 'password')
    })

    it('testing the add blog form', function() {
      addBlog('My test blog', 'Cypress', 'https://testing-with-cypress.com')
      cy.contains('My test blog by Cypress')
    })
  })

  describe('and a blog exists', function () {
    beforeEach(function () {
      loginWith('admin', 'password')
      addBlog('My test blog', 'Cypress', 'https://testing-with-cypress.com')
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