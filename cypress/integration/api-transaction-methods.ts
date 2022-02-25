import * as monitor from 'vendors/monitor'
import * as oasisscan from 'vendors/oasisscan'

describe('check all transaction methods are handled', () => {
  it('by parsing latest transactions on oasismonitor', () => {
    cy.request('https://monitor.oasis.dev/data/transactions?limit=2000')
      .should((response) => {
        if (!response.isOkStatusCode) return // Ignore if API is broken

        response.body.forEach((transactionFromApi) => {
          const [parsedTransaction] = monitor.parseTransactionsList([transactionFromApi])
          expect(parsedTransaction.type).to.be.a('string', `parse transaction type "${transactionFromApi.type}" to a string`)
        })
      })
  })

  it('by comparing list of methods from oasisscan', () => {
    cy.request('https://api.oasisscan.com/mainnet/chain/methods')
      .should((response) => {
        if (!response.isOkStatusCode) return // Ignore if API is broken

        const allApiMethods = response.body.data.list
        expect(allApiMethods).to.have.length(Object.keys(oasisscan.transactionMethodMap).length)
        expect(oasisscan.transactionMethodMap).to.have.keys(allApiMethods)
      })
  })
})
