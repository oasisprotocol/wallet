import { account } from '../fixtures/account'

describe('Create wallet', () => {
  let generatedMnemonic: string

  before(() => {
    cy.intercept('/data/accounts/*', { body: JSON.stringify(account) })
    cy.visit('/create-wallet')
    cy.findByRole('button', { name: /Generate a new mnemonic/ }).click()
  })

  it('Should have generated a mnemonic', () => {
    cy.findByTestId('generated-mnemonic')
      .should('be.visible')
      .invoke('text')
      .then(text => {
        generatedMnemonic = text
      })
  })

  it('should not be able to submit without confirmation', () => {
    cy.findByRole('button', { name: /Import my wallet/ }).should('be.disabled')
  })

  it('Should open mnemonic confirmation', () => {
    cy.findByLabelText(/saved/).click({ force: true })
    cy.findByRole('button', { name: /Import my wallet/ })
      .should('be.enabled')
      .click()
  })

  it('Should not be able to confirm with a different (valid) mnemonic', () => {
    cy.contains('mnemonic does not match').should('not.exist')

    cy.findByPlaceholderText('Enter your mnemonic here').type(
      'abuse gown claw final toddler wedding sister parade useful typical spatial skate decrease bulk student manual cloth shove fat car little swamp tag ginger',
      { delay: 0 },
    )
    cy.findByRole('button', { name: /Import my wallet/ }).click()
    cy.contains('mnemonic does not match').should('exist')
  })

  it('Should confirm mnemonic', () => {
    cy.findByRole('button', { name: /Send/ }).should('not.exist')
    cy.findByRole('button', { name: /Import my wallet/ }).click()
    cy.findByPlaceholderText('Enter your mnemonic here').type(generatedMnemonic, { delay: 0 })
    cy.findByRole('button', { name: /Import my wallet/ }).click()
    cy.contains('mnemonic does not match').should('not.exist')
    cy.findByRole('checkbox', { name: /Create a profile/ }).uncheck({ force: true })
    cy.findByRole('button', { name: /Open/ }).click()
    cy.findByRole('button', { name: /Send/ }).should('exist')
  })
})
