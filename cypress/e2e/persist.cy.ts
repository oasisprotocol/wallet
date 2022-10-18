const mnemonic = 'planet believe session regular rib kiss police deposit prison hundred apart tongue'
const mnemonicAddress0 = 'oasis1qqca0gplrfn63ljg9c833te7em36lkz0cv8djffh'

const privateKey = 'X0jlpvskP1q8E6rHxWRJr7yTvpCuOPEKBGW8gtuVTxfnViTI0s2fBizgMxNzo75Q7w7MxdJXtOLeqDoFUGxxMg=='
const privateKeyAddress = 'oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk'

const password = 'abcd1234&'
const wrongPassword = 'wrongPassword1&'

function mockAccountAPI(address: string, balance: number) {
  return cy.intercept('*', request => {
    if (request.url.endsWith(`/data/accounts/${address}`)) { // oasismonitor
      request.reply({
        address: address,
        liquid_balance: balance * 10 ** 9,
        escrow_balance: 0,
        escrow_debonding_balance: 0,
        delegations_balance: 0,
        debonding_delegations_balance: 0,
        self_delegation_balance: 0,
        total_balance: 0,
        nonce: 0,
      })
    }
    if (request.url.endsWith(`/chain/account/info/${address}`)) { // oasisscan
      request.reply({
        code: 0,
        data: {
          address: address,
          available: balance.toString(),
          escrow: '0',
          debonding: '0',
          total: '0',
          nonce: 0,
          allowances: [],
        },
      })
    }
  })
}

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

  it('Should reload balance after unlocking, in case balance has changed while locked', () => {
    cy.visit('/open-wallet/private-key')
    mockAccountAPI(privateKeyAddress, 123)
    cy.findByRole('checkbox', { name: 'Store private keys locally, protected by a password' }).check({ force: true })
    cy.findByPlaceholderText('Enter your private key here').type(`${privateKey}{Enter}`, { delay: 1 })
    cy.findByPlaceholderText('Enter your password here').type(`${password}{Enter}`)
    cy.findByPlaceholderText('Re-enter your password').type(`${password}{Enter}`)
    cy.url().should('include', privateKeyAddress)
    cy.findByTestId('account-balance-summary').invoke('text').should('contain', '123.0')
    cy.findByRole('button', { name: /Lock profile/ }).click()
    mockAccountAPI(privateKeyAddress, 456)
    cy.findByPlaceholderText('Enter your password here').type(`${password}{Enter}`)
    cy.findByTestId('account-balance-summary').invoke('text').should('contain', '456.0')
  })
})
