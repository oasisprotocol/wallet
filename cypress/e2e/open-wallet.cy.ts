import { account } from '../fixtures/account'

describe('Open wallet', () => {
  beforeEach(() => {
    cy.intercept('/data/accounts/*', { body: JSON.stringify(account) })
  })

  describe('Private Key', () => {
    beforeEach(() => {
      cy.visit('/open-wallet/private-key')
      cy.findByRole('checkbox', { name: /Create a profile/ }).uncheck({ force: true })
    })

    it('Should reject invalid keys', () => {
      cy.findByPlaceholderText('Enter your private key here').type('this is an invalid key')
      cy.findByRole('button', { name: /Import my wallet/ }).click()
      cy.findByText(/Invalid private key/).should('be.visible')
    })

    it('Should reject invalid keys, even if base64 seems to be OK', () => {
      cy.findByPlaceholderText('Enter your private key here').type(
        'aaamZybIOymrQCpCGGICczsaopANP02kwOhCyxETXljLLmRChL1QJGzJq3Pf3i+dFBN+peIK2vQ3Ew0wSQbp3g==',
        { delay: 1 },
      )
      cy.findByRole('button', { name: /Import my wallet/ }).click()
      cy.findByText(/Invalid private key/).should('be.visible')
    })
  })
})
