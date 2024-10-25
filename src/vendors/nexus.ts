import { Configuration } from 'vendors/nexus/index'

import { throwAPIErrors } from './helpers'

export function getNexusAPIs(url: string | 'https://nexus.oasis.io/v1/consensus/') {
  const explorerConfig = new Configuration({
    basePath: url,
    ...throwAPIErrors,
  })

  return {}
}
