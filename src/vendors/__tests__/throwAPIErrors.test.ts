import { WalletError, WalletErrors } from 'types/errors'
import { getOasisscanAPIs } from '../oasisscan'

describe('throwAPIErrors', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  test('should throw an error on HTTP error status', async () => {
    jest.spyOn(window, 'fetch').mockImplementationOnce(async info => {
      return Object.assign(
        new Response('', {
          status: 502,
        }),
        {
          url: new Request(info).url,
        },
      )
    })
    const http502 = getOasisscanAPIs('https://api.oasisscan.com/mainnet/').getAccount('oasis1')
    await expect(http502).rejects.toThrowError(WalletError)
    await expect(http502).rejects.toHaveProperty('type', WalletErrors.IndexerAPIError)
  })
})
