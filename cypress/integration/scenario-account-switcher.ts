describe('Scenario : multiple accounts', () => {
  it('Should open both accounts', () => {
    cy.visit('/')

    // Open account 1 through mnemonic
    cy.findByRole('button', { name: /Open wallet/ }).click()
    cy.findByRole('button', { name: /Mnemonic/ }).click()
    cy.findByTestId('mnemonic').type(
      'abuse gown claw final toddler wedding sister parade useful typical spatial skate decrease bulk student manual cloth shove fat car little swamp tag ginger',
      { delay: 0 },
    )
    cy.findByRole('button', { name: /Open my wallet/ }).click()
    cy.url().should('include', '/account/oasis1qq8dt2jxf57kuszg3mdf78wtkggsvtuepctlftnn')

    cy.findByTestId('nav-home').click()

    // Open account 2 through private
    cy.findByRole('button', { name: /Open wallet/ }).click()
    cy.findByRole('button', { name: /Private key/ }).click()
    cy.findByTestId('privatekey').type(
      'X0jlpvskP1q8E6rHxWRJr7yTvpCuOPEKBGW8gtuVTxfnViTI0s2fBizgMxNzo75Q7w7MxdJXtOLeqDoFUGxxMg==',
      { delay: 0 },
    )
    cy.findByRole('button', { name: /Open my wallet/ }).click()
    cy.url().should('include', '/account/oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk')
  })

  it('Should allow switching back to the first account', () => {
    cy.findByTestId('account-selector').click()
    cy.findAllByTestId('account-choice').eq(0).click()

    cy.findByTestId('nav-myaccount').click()
    cy.url().should('include', '/account/oasis1qq8dt2jxf57kuszg3mdf78wtkggsvtuepctlftnn')
  })
})
