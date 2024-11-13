import { test, expect } from '@playwright/test'

test('validate if API is missing historical data', async ({ request }) => {
  const expectedResponse = {
    code: 0,
    message: 'OK',
    data: null,
  }

  const response = await request.get('https://www.oasisscan.com/v2/mainnet/chain/block/16817955')
  if (response.status() === 200) {
    const jsonResponse = await response.json()
    expect(jsonResponse).toEqual(expectedResponse)
  } else {
    console.warn(`Skipping V2 test due to API issues: ${response.status()}`)
  }
})
