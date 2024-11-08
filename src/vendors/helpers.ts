import { Validator } from 'app/state/staking/types'
import { WalletError, WalletErrors } from 'types/errors'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { BaseAPI, ConfigurationParameters } from 'vendors/oasisscan/runtime'

const ValidatorStatusPriority = {
  active: 1,
  unknown: 2,
  inactive: 3,
}

export const sortByStatus = (a: Validator, b: Validator) =>
  ValidatorStatusPriority[a.status] - ValidatorStatusPriority[b.status]

/**
 * Throw errors instead of OpenAPI-generated-code throwing response objects.
 * See {@link BaseAPI#request}
 */
export const throwAPIErrors: ConfigurationParameters = {
  fetchApi: async (info, init) => {
    try {
      const response = await fetch(info, init)
      // eslint-disable-next-line no-throw-literal
      if (response.status < 200 || response.status >= 300) throw `status ${response.status}` // Re-thrown below
      return response
    } catch (err: any) {
      const url = new Request(info).url
      throw new WalletError(WalletErrors.IndexerAPIError, `Request failed ${url} with ${err}`, err)
    }
  },
  // Don't use post-request middleware! It clones the response. Same issue in Ky:
  // https://github.com/sindresorhus/ky/pull/356
}
