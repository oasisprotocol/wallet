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
      const response = await window.fetch(info, init)
      return response
    } catch (err: any) {
      const url = new Request(info).url
      throw new WalletError(WalletErrors.IndexerAPIError, `Request failed ${url} with ${err}`, err)
    }
  },
  middleware: [
    {
      post: async ({ response }) => {
        if (response.status < 200 || response.status >= 300) {
          throw new WalletError(
            WalletErrors.IndexerAPIError,
            `Request failed ${response.url} with status ${response.status}`,
          )
        }
      },
    },
  ],
}
