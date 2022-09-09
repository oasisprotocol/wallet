export const parseBalance = (balance: string) => {
  return parseFloat(balance.replace(/,/g, ''))
}

describe('Scenario : from mnemonic', () => {
  let senderBalanceBefore: number
  let recipientBalanceBefore: number

  before(function () {
    cy.visit('/account/oasis1qq5t7f2gecsjsdxmp5zxtwgck6pzpjmkvc657z6l')
    cy.contains('Loading account').should('not.exist')
    cy.findByTestId('account-balance-total').then($div => {
      senderBalanceBefore = parseBalance($div.text())
    })

    cy.visit('/account/oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk')
    cy.contains('Loading account').should('not.exist')
    cy.findByTestId('account-balance-total').then($div => {
      recipientBalanceBefore = parseBalance($div.text())
    })
  })

  it('Should open the account', () => {
    cy.visit('/')
    cy.findByRole('button', { name: /Open wallet/ }).click()
    cy.findByRole('button', { name: /Mnemonic/ }).click()
    cy.findByTestId('mnemonic').type(
      'abuse gown claw final toddler wedding sister parade useful typical spatial skate decrease bulk student manual cloth shove fat car little swamp tag ginger',
      { delay: 1 },
    )
    cy.findByRole('button', { name: /Import my wallet/ }).click()
    cy.findByRole('button', { name: /Open/ }).click()
    cy.url().should('include', '/account/oasis1qq5t7f2gecsjsdxmp5zxtwgck6pzpjmkvc657z6l')
  })

  it('Should send a transaction', () => {
    cy.get('#recipient-id').type('oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk')
    cy.get('#amount-id').type('10')
    cy.findByRole('button', { name: /Send/ }).click()
    cy.findByRole('button', { name: /Confirm/ }).click()
    cy.contains('Transaction successfully sent').should('be.visible')
  })

  it('Should have updated balances', function () {
    cy.findByTestId('account-balance-total')
      .invoke('text')
      .then(parseBalance)
      .should('be.eq', senderBalanceBefore - 10)

    cy.visit('/account/oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk')
    cy.contains('Loading account').should('not.exist')
    cy.findByTestId('account-balance-total')
      .invoke('text')
      .then(parseBalance)
      .should('be.eq', recipientBalanceBefore + 10)
  })
})

describe('Scenario : from private key', () => {
  let senderBalanceBefore: number
  let recipientBalanceBefore: number

  before(function () {
    cy.visit('/account/oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk')
    cy.contains('Loading account').should('not.exist')
    cy.findByTestId('account-balance-total').then($div => {
      senderBalanceBefore = parseBalance($div.text())
    })

    cy.visit('/account/oasis1qq5t7f2gecsjsdxmp5zxtwgck6pzpjmkvc657z6l')
    cy.contains('Loading account').should('not.exist')
    cy.findByTestId('account-balance-total').then($div => {
      recipientBalanceBefore = parseBalance($div.text())
    })
  })

  it('Should open the account', () => {
    cy.visit('/')
    cy.findByRole('button', { name: /Open wallet/ }).click()
    cy.findByRole('button', { name: /Private key/ }).click()
    cy.findByTestId('privatekey').type(
      'X0jlpvskP1q8E6rHxWRJr7yTvpCuOPEKBGW8gtuVTxfnViTI0s2fBizgMxNzo75Q7w7MxdJXtOLeqDoFUGxxMg==',
      { delay: 1 },
    )
    cy.findByRole('button', { name: /Import my wallet/ }).click()
  })

  it('Should send a transaction', () => {
    cy.get('#recipient-id').type('oasis1qq5t7f2gecsjsdxmp5zxtwgck6pzpjmkvc657z6l')
    cy.get('#amount-id').type('10')
    cy.findByRole('button', { name: /Send/ }).click()
    cy.findByRole('button', { name: /Confirm/ }).click()
    cy.contains('Transaction successfully sent').should('be.visible')
  })

  it('Should have updated balances', function () {
    cy.findByTestId('account-balance-total')
      .invoke('text')
      .then(parseBalance)
      .should('be.eq', senderBalanceBefore - 10)

    cy.visit('/account/oasis1qq5t7f2gecsjsdxmp5zxtwgck6pzpjmkvc657z6l')
    cy.contains('Loading account').should('not.exist')
    cy.findByTestId('account-balance-total')
      .invoke('text')
      .then(parseBalance)
      .should('be.eq', recipientBalanceBefore + 10)
  })
})
