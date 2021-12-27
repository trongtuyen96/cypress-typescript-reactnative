/// <reference types='cypress' />

it('load lists of users', () => {
    cy.intercept('/users').as('users')
    cy.visit('/')
    cy.wait('@users').its('response.body')
        .should('be.an', 'Array')
        .and('have.length.gt', 5)
        .then(users => {
            cy.get('[data-testid=user]').should('have.length', users.length)
        })
})

it('show loading indicator', () => {
    // slow down the response by 1 second
    // https://on.cypress.io/intercept
    cy.intercept('/users', (req) => {
        // use bundled Bluebird library
        // which has utility method .delay
        // https://on.cypress.io/promise
        return Cypress.Promise.delay(1000).then(() => req.continue())
    }).as('users')
    cy.visit('/')
    cy.get('[data-testid=loading]').should('be.visible')
    cy.get('[data-testid=loading]').should('not.exist')
    cy.wait('@users')
})

it('show loading indicator - simplify', () => {
    cy.intercept('/users', {
        fixture: 'users.json', delay: 1000
    }).as('users')
    cy.visit('/')
    cy.get('[data-testid=loading]').should('be.visible')
    cy.get('[data-testid=loading]').should('not.exist')
    cy.get('[data-testid=user]').should('have.length', 3)
})

it.only('shows mock data', () => {
    cy.intercept('/users', { fixture: 'users.json' }).as('users')
    cy.visit('/')
    cy.get('[data-testid=user]').should('have.length', 3)
})