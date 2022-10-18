const mnemonic = 'planet believe session regular rib kiss police deposit prison hundred apart tongue'
const mnemonicAddress0 = 'oasis1qqca0gplrfn63ljg9c833te7em36lkz0cv8djffh'

const privateKey = 'X0jlpvskP1q8E6rHxWRJr7yTvpCuOPEKBGW8gtuVTxfnViTI0s2fBizgMxNzo75Q7w7MxdJXtOLeqDoFUGxxMg=='
const privateKeyAddress = 'oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk'

const password = 'abcd1234&'
const wrongPassword = 'wrongPassword1&'

describe('Persist', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.clearLocalStorage()
  })

  it('Should persist multiple mnemonic accounts', () => {
    cy.visit('/open-wallet/mnemonic')

    cy.findByPlaceholderText('Enter your keyphrase here').type(mnemonic, { delay: 1 })
    cy.findByRole('button', { name: /Import my wallet/ }).click()
    cy.findAllByTestId('account-choice')
      .should('have.length', 4)
      .find('input:not(:checked)')
      .should('have.length', 3)
      .click({ force: true, multiple: true })

    cy.findByRole('checkbox', { name: 'Store private keys locally, protected by a password' })
      .should('be.enabled')
      .and('not.be.checked')
      .check({ force: true })
    cy.findByRole('button', { name: /Open/ }).click()

    cy.log('Expect password must be chosen')
    cy.url().should('not.include', mnemonicAddress0)
    cy.findByPlaceholderText('Enter your password here').type(`${password}{Enter}`)

    cy.log('Expect repeated password must match')
    cy.url().should('not.include', mnemonicAddress0)
    cy.findByPlaceholderText('Re-enter your password').type(`${wrongPassword}{Enter}`)
    cy.url().should('not.include', mnemonicAddress0)
    cy.findByPlaceholderText('Re-enter your password').clear().type(`${password}{Enter}`)
    cy.url().should('include', mnemonicAddress0)

    cy.findByTestId('account-selector').click({ timeout: 15_000 })
    cy.findAllByTestId('account-choice').should('have.length', 4)
    cy.url().should('include', mnemonicAddress0)

    cy.visit('/')

    cy.log('Expect correct password is required')
    cy.url().should('not.include', mnemonicAddress0)
    cy.findByPlaceholderText('Enter your password here').type(`${wrongPassword}{Enter}`)
    cy.url().should('not.include', mnemonicAddress0)
    cy.findByPlaceholderText('Enter your password here').clear().type(`${password}{Enter}`)
    cy.url().should('include', mnemonicAddress0)

    cy.findByTestId('account-selector').click({ timeout: 15_000 })
    cy.findAllByTestId('account-choice').should('have.length', 4)
  })

  it('Should persist private key account', () => {
    cy.visit('/open-wallet/private-key')

    cy.findByRole('checkbox', { name: 'Store private keys locally, protected by a password' })
      .should('be.enabled')
      .and('not.be.checked')
      .check({ force: true })

    cy.findByPlaceholderText('Enter your private key here').type(`${privateKey}{Enter}`, { delay: 1 })

    cy.log('Expect password must be chosen')
    cy.url().should('not.include', privateKeyAddress)
    cy.findByPlaceholderText('Enter your password here').type(`${password}{Enter}`)

    cy.log('Expect repeated password must match')
    cy.url().should('not.include', privateKeyAddress)
    cy.findByPlaceholderText('Re-enter your password').type(`${wrongPassword}{Enter}`)
    cy.url().should('not.include', privateKeyAddress)
    cy.findByPlaceholderText('Re-enter your password').clear().type(`${password}{Enter}`)
    cy.url().should('include', privateKeyAddress)

    cy.visit('/')

    cy.log('Expect correct password is required')
    cy.url().should('not.include', privateKeyAddress)
    cy.findByPlaceholderText('Enter your password here').type(`${wrongPassword}{Enter}`)
    cy.url().should('not.include', privateKeyAddress)
    cy.findByPlaceholderText('Enter your password here').clear().type(`${password}{Enter}`)
    cy.url().should('include', privateKeyAddress)

    cy.findByTestId('account-selector').click({ timeout: 15_000 })
    cy.findAllByTestId('account-choice').should('have.length', 1)
  })
})
