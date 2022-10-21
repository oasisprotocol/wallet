describe('The homepage should load', () => {
  it('should have options to open the wallet', () => {
    cy.visit('/')
    cy.findByRole('link', { name: /Open wallet/i })
    cy.findByRole('link', { name: /Create wallet/i })
  })
})
