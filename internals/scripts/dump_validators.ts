import fs from 'fs'
import path from 'path'
import { getOasisscanAPIs } from '../../src/vendors/oasisscan'

// Abusing jest to handle typescript and run this
test('dump validators', async () => {
  const { getAllValidators } = getOasisscanAPIs('https://api.oasisscan.com/mainnet/')
  const validators = await getAllValidators()

  const json = {
    dump_timestamp: Date.now(),
    dump_timestamp_iso: new Date().toISOString(),
    list: validators,
  }
  fs.writeFileSync(
    path.join(__dirname, '../../src/vendors/oasisscan/dump_validators.json'),
    JSON.stringify(json, null, 2) + '\n',
    'utf8',
  )
}, 10_000)
