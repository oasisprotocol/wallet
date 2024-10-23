import { Configuration } from 'vendors/oasisscan-v2/index'

import { throwAPIErrors } from './helpers'

export function getOasisscanV2APIs(url: string | 'https://api.oasisscan.com/v2/mainnet') {
  const explorerConfig = new Configuration({
    basePath: url,
    ...throwAPIErrors,
  })

  return {}
}
