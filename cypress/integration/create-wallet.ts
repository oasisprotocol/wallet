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

  describe('Confirm mnemonic', () => {
    for (let i = 1; i <= 5; i++) {
      // eslint-disable-next-line no-loop-func
      it(`Should pick word ${i}/5`, () => {
        cy.findByTestId('pick-word')
          .invoke('text')
          .then(text => {
            const id = Number(text.match(/#([0-9]+)/)![1])
            const missing = generatedMnemonic.split(' ')[id - 1]
            cy.findByRole('button', { name: missing }).click()
          })
      })
    }
  })
})
