import { account } from '../fixtures/account'

describe('Open wallet', () => {
  beforeEach(() => {
    cy.intercept('/data/accounts/*', { body: JSON.stringify(account) })
  })

  describe('Method selection', () => {
    it('Should be able to open from Mnemonic', () => {
      cy.visit('/open-wallet')
      cy.findByRole('link', { name: /Mnemonic/ }).click()
      cy.url().should('include', 'mnemonic')
    })

    it('Should be able to open from private key', () => {
      cy.visit('/open-wallet')
      cy.findByRole('link', { name: /Private key/ }).click()
      cy.url().should('include', 'private-key')
    })
  })

  describe('Mnemonic', () => {
    const mnemonic = 'planet believe session regular rib kiss police deposit prison hundred apart tongue'
    beforeEach(() => {
      cy.visit('/open-wallet/mnemonic')
    })

    it('Should reject invalid mnemonics', () => {
      cy.findByPlaceholderText('Enter your keyphrase here').type('this is an invalid mnemonic')
      cy.findByRole('button', { name: /Import my wallet/ }).click()
      cy.findByText(/Invalid keyphrase/).should('be.visible')
    })

    it('Should accept valid mnemonic', () => {
      cy.findByPlaceholderText('Enter your keyphrase here').type(mnemonic, { delay: 1 })
      cy.findByRole('button', { name: /Import my wallet/ }).click()
      cy.findByText(/Invalid keyphrase/).should('not.exist')
      cy.findByRole('button', { name: /Open/ }).click()
      cy.url().should('include', 'oasis1qqca0gplrfn63ljg9c833te7em36lkz0cv8djffh')
    })

    it('Should open multiple accounts from mnemonic', () => {
      cy.findByPlaceholderText('Enter your keyphrase here').type(mnemonic, { delay: 1 })
      cy.findByRole('button', { name: /Import my wallet/ }).click()
      cy.findAllByTestId('account-choice').should('have.length', 4)
      cy.findAllByRole('checkbox', { name: /oasis1/, checked: false })
        .should('have.length', 3)
        .click({ force: true, multiple: true })

      cy.findByRole('button', { name: /Open/ }).click()
      cy.url().should('include', 'oasis1qqca0gplrfn63ljg9c833te7em36lkz0cv8djffh')

      cy.log('Should allow importing and re-selecting the same accounts')
      cy.findByRole('link', { name: /Home/ }).click()
      cy.findByRole('link', { name: /Open wallet/ }).click()
      cy.findByRole('link', { name: /Mnemonic/ }).click()
      cy.url().should('include', '/open-wallet/mnemonic')

      cy.findByPlaceholderText('Enter your keyphrase here').type(mnemonic, { delay: 1 })
      cy.findByRole('button', { name: /Import my wallet/ }).click()
      cy.findAllByTestId('account-choice').should('have.length', 4)
      cy.findAllByRole('checkbox', { name: /oasis1/, checked: false })
        .should('have.length', 3)
        .click({ force: true, multiple: true })

      cy.findByRole('button', { name: /Open/ }).click()
      cy.url().should('include', 'oasis1qqca0gplrfn63ljg9c833te7em36lkz0cv8djffh')
    })
  })

  describe('Private Key', () => {
    const privateKey = 'X0jlpvskP1q8E6rHxWRJr7yTvpCuOPEKBGW8gtuVTxfnViTI0s2fBizgMxNzo75Q7w7MxdJXtOLeqDoFUGxxMg=='
    beforeEach(() => {
      cy.visit('/open-wallet/private-key')
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

    it('Should accept valid base64 pkey', () => {
      cy.findByPlaceholderText('Enter your private key here').type(privateKey, { delay: 1 })
      cy.findByRole('button', { name: /Import my wallet/ }).click()
      cy.findByText(/Invalid private key/).should('not.exist')
      cy.url().should('include', '/account/oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk')

      cy.log('Should allow importing and re-selecting the same account')
      cy.findByRole('link', { name: /Home/ }).click()
      cy.findByRole('link', { name: /Open wallet/ }).click()
      cy.findByRole('link', { name: /Private key/ }).click()
      cy.url().should('include', '/open-wallet/private-key')
      cy.findByPlaceholderText('Enter your private key here').type(privateKey, { delay: 1 })
      cy.findByRole('button', { name: /Import my wallet/ }).click()
      cy.url().should('include', '/account/oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk')
    })
  })

  // it('should not be able to submit without confirmation', () => {
  //   cy.findByRole('button', { name: /Import my wallet/ }).should('be.disabled')
  // });

  // it('should be able to submit with confirmation', () => {
  //   cy.findByLabelText(/saved/).click({ force: true })
  //   cy.findByRole('button', { name: /Import my wallet/ }).should('be.enabled')
  // });

  // it('Should open wallet', () => {
  //   cy.findByLabelText(/saved/).click({ force: true })
  //   cy.findByRole('button', { name: /Import my wallet/ }).should('be.enabled').click()
  //   cy.url().should('include', '/wallet')
  // })

  // it('Should be able to close the wallet once opened', () => {
  //   cy.findByLabelText(/saved/).click({ force: true })
  //   cy.findByRole('button', { name: /Import my wallet/i }).click()
  //   cy.url().should('include', '/wallet')
  //   cy.get('button[aria-label="Close Wallet"]').click()

  //   // Back to homepage
  //   cy.findByRole('link', { name: /Create wallet/i }).should('be.visible')
  // })
})
