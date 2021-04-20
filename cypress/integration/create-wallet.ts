import { account } from "../fixtures/account";

describe('Create wallet', () => {
  beforeEach(() => {
    cy.intercept('/data/accounts/*', { body: JSON.stringify(account) })
    cy.visit('/create-wallet');
  })
  it('should not be able to submit without confirmation', () => {
    cy.findByRole('button', { name: /Open my wallet/ }).should('be.disabled')
  });

  it('should be able to submit with confirmation', () => {
    cy.findByLabelText(/saved/).click({ force: true })
    cy.findByRole('button', { name: /Open my wallet/ }).should('be.enabled')
  });

  it('Should open wallet', () => {
    cy.findByLabelText(/saved/).click({ force: true })
    cy.findByRole('button', { name: /Open my wallet/ }).should('be.enabled').click()
    cy.url().should('include', '/account')
  })

  it('Should be able to close the wallet once opened', () => {
    cy.findByLabelText(/saved/).click({ force: true })
    cy.findByRole('button', { name: /Open my wallet/i }).click()
    cy.url().should('include', '/account')
    cy.get('button[aria-label="Close wallet"]').click()

    // Back to homepage
    cy.findByRole('button', { name: /Create wallet/i }).should('be.visible')
  })
});