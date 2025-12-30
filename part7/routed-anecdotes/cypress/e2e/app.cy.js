describe('Routed Anecdotes app', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173')
  })

  it('main page can be opened', () => {
    cy.contains('Software anecdotes')
    cy.contains('Anecdote app for Full Stack Open. See https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js for the source code.')
  })

  it('the anecdotes are rendered on the main page', () => {
    cy.get('li').eq(0).contains('If it hurts, do it more often')
    cy.get('li').eq(1).contains('Premature optimization is the root of all evil')
  })

  it('clicking on an anecdote displays all info', () => {
    cy.contains('a', 'If it hurts, do it more often').click()
    cy.get('h2').contains('If it hurts, do it more often by Jez Humble')
    cy.contains('p', 'has 0 votes')
    cy.contains('p', 'for more info see https://martinfowler.com/bliki/FrequencyReducesDifficulty.html')
  })

  it('the footer is visible on all pages', () => {
    cy.contains('div', 'Anecdote app for Full Stack Open. See https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js for the source code.')

    cy.get('a').contains('a', 'create new').click()
    cy.contains('div', 'Anecdote app for Full Stack Open. See https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js for the source code.')

    cy.get('a').contains('a', 'about').click()
    cy.contains('div', 'Anecdote app for Full Stack Open. See https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js for the source code.')
  })

  describe('testing the create new form', () => {
    beforeEach(() => {
      cy.get('a').contains('a', 'create new').click()

      cy.get('#content-field').type('My first anecdote')
      cy.get('#author-field').type('Myself')
      cy.get('#info-field').type('http://example.com')
    })

    it('adding a new anecdote', () => {
      cy.contains('button', 'create').click()
      cy.get('li').eq(2).contains('My first anecdote')
    })

    it('the reset button clears out all form fields', () => {
      cy.contains('button', 'reset').click()

      cy.get('#content-field').should('have.value', '')
      cy.get('#author-field').should('have.value', '')
      cy.get('#info-field').should('have.value', '')
    })

    it('adding a new anecdote displays a notification on the main page', () => {
      cy.contains('button', 'create').click()
      cy.contains('p', 'a new anecdote My first anecdote created!')
    })
  })

  describe('testing the React Router top menu', () => {
    it('can navigate to the create new form', () => {
      cy.get('a').contains('a', 'create new').click()

      cy.contains('h2', 'create a new anecdote')
      cy.contains('label', 'content')
      cy.contains('label', 'author')
      cy.contains('label', 'url for more info')
    })

    it('can navigate to the about section', () => {
      cy.get('a').contains('a', 'about').click()

      cy.contains('h2', 'About anecdote app')
      cy.contains('p', 'Software engineering is full of excellent anecdotes, at this app you can find the best and add more')
    })

    it('clicking on anecdotes from another menu item sends back to the home page', () => {
      cy.get('a').contains('a', 'about').click()
      cy.contains('h2', 'About anecdote app')

      cy.get('a').contains('a', 'anecdotes').click()
      cy.contains('h2', 'Anecdotes')

      cy.get('li').eq(0).contains('If it hurts, do it more often')
      cy.get('li').eq(1).contains('Premature optimization is the root of all evil')
    })
  })
})