import { account } from '../fixtures/account'

describe('Create wallet', () => {
  let generatedMnemonic: string

  before(() => {
    cy.intercept('/data/accounts/*', { body: JSON.stringify(account) })
    cy.visit('/create-wallet')
  })

  it('Should have generated a mnemonic', () => {
    cy.findByTestId('generated-mnemonic')
      .invoke('text')
      .then(text => {
        generatedMnemonic = text
      })
  })

  it('should not be able to submit without confirmation', () => {
    cy.findByRole('button', { name: /Open my wallet/ }).should('be.disabled')
  })

  it('Should open mnemonic confirmation', () => {
    cy.findByLabelText(/saved/).click({ force: true })
    cy.findByRole('button', { name: /Open my wallet/ })
      .should('be.enabled')
      .click()
  })

  it('Should not be able to confirm with a different (valid) mnemonic', () => {
    cy.contains('mnemonic does not match').should('not.exist')

    cy.findByTestId('mnemonic').type(
      'abuse gown claw final toddler wedding sister parade useful typical spatial skate decrease bulk student manual cloth shove fat car little swamp tag ginger',
      { delay: 0 },
    )
    cy.findByRole('button', { name: /Open my wallet/ }).click()
    cy.contains('mnemonic does not match').should('exist')
  })

  it('Should confirm mnemonic', () => {
    cy.findByRole('button', { name: /Send/ }).should('not.exist')
    cy.findByRole('button', { name: /Open my wallet/ }).click()
    cy.findByTestId('mnemonic').type(generatedMnemonic, { delay: 0 })
    cy.findByRole('button', { name: /Open my wallet/ }).click()
    cy.contains('mnemonic does not match').should('not.exist')
    cy.findByRole('button', { name: /Send/ }).should('exist')
  })
})
