describe('The homepage should load', () => {
  it('should have options to open the wallet', () => {
    cy.visit('/')
    cy.findByRole('button', { name: /Open wallet/i })
    cy.findByRole('button', { name: /Create wallet/i })
  })
})
