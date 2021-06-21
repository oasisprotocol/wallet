import { account } from '../fixtures/account'

describe('Open wallet', () => {
  beforeEach(() => {
    cy.intercept('/data/accounts/*', { body: JSON.stringify(account) })
  })

  describe('Method selection', () => {
    it('Should be able to open from Mnemonic', () => {
      cy.visit('/open-wallet')
      cy.findByRole('button', { name: /Mnemonic/ }).click()
      cy.url().should('include', 'mnemonic')
    })

    it('Should be able to open from private key', () => {
      cy.visit('/open-wallet')
      cy.findByRole('button', { name: /Private key/ }).click()
      cy.url().should('include', 'private-key')
    })
  })

  describe('Mnemonic', () => {
    beforeEach(() => {
      cy.visit('/open-wallet/mnemonic')
    })

    it('Should reject invalid mnemonics', () => {
      cy.findByTestId('mnemonic').type('this is an invalid mnemonic')
      cy.findByRole('button', { name: /Open my wallet/ }).click()
      cy.findByText(/Invalid keyphrase/).should('be.visible')
    })

    it('Should accept valid mnemonic', () => {
      cy.findByTestId('mnemonic').type(
        'planet believe session regular rib kiss police deposit prison hundred apart tongue',
        { delay: 1 },
      )
      cy.findByRole('button', { name: /Open my wallet/ }).click()
      cy.findByText(/Invalid keyphrase/).should('not.exist')
      cy.url().should('include', 'oasis1qqca0gplrfn63ljg9c833te7em36lkz0cv8djffh')
    })
  })

  describe('Private Key', () => {
    beforeEach(() => {
      cy.visit('/open-wallet/private-key')
    })

    it('Should reject invalid keys', () => {
      cy.findByTestId('privatekey').type('this is an invalid key')
      cy.findByRole('button', { name: /Open my wallet/ }).click()
      cy.findByText(/Invalid private key/).should('be.visible')
    })

    it('Should accept valid base64 pkey', () => {
      cy.findByTestId('privatekey').type(
        'X0jlpvskP1q8E6rHxWRJr7yTvpCuOPEKBGW8gtuVTxfnViTI0s2fBizgMxNzo75Q7w7MxdJXtOLeqDoFUGxxMg==',
        { delay: 1 },
      )
      cy.findByRole('button', { name: /Open my wallet/ }).click()
      cy.findByText(/Invalid private key/).should('not.exist')
      cy.url().should('include', '/account/oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk')
    })
  })

  // it('should not be able to submit without confirmation', () => {
  //   cy.findByRole('button', { name: /Open my wallet/ }).should('be.disabled')
  // });

  // it('should be able to submit with confirmation', () => {
  //   cy.findByLabelText(/saved/).click({ force: true })
  //   cy.findByRole('button', { name: /Open my wallet/ }).should('be.enabled')
  // });

  // it('Should open wallet', () => {
  //   cy.findByLabelText(/saved/).click({ force: true })
  //   cy.findByRole('button', { name: /Open my wallet/ }).should('be.enabled').click()
  //   cy.url().should('include', '/wallet')
  // })

  // it('Should be able to close the wallet once opened', () => {
  //   cy.findByLabelText(/saved/).click({ force: true })
  //   cy.findByRole('button', { name: /Open my wallet/i }).click()
  //   cy.url().should('include', '/wallet')
  //   cy.get('button[aria-label="Close Wallet"]').click()

  //   // Back to homepage
  //   cy.findByRole('button', { name: /Create wallet/i }).should('be.visible')
  // })
})
