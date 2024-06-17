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

const instanceOfUrlInRequest = (obj: any): obj is Request => {
  return typeof obj === 'object' && 'url' in obj
}

const cacheMap: Record<string, Partial<Response>> = {}

/**
 * Throw errors instead of OpenAPI-generated-code throwing response objects.
 * See {@link BaseAPI#request}
 */
export const APIMiddleware = ({ cache = false } = {}): ConfigurationParameters => ({
  fetchApi: async (info, init) => {
    const url = instanceOfUrlInRequest(info) ? info.url : info.toString()

    try {
      if (cache && url in cacheMap) {
        const { body, status, headers, statusText } = cacheMap[url]
        return new Response(JSON.stringify(body), {
          status,
          headers,
          statusText,
        })
      }

      const response = await window.fetch(info, init)

      // eslint-disable-next-line no-throw-literal
      if (response.status < 200 || response.status >= 300) throw `status ${response.status}` // Re-thrown below

      if (cache && response.status === 200) {
        // Allow multiple uses of body objects
        const clonedResponse = await response.clone()

        const { status, statusText, headers } = clonedResponse
        const body = await clonedResponse.json()

        cacheMap[url] = { body, status, statusText, headers }
      }

      return response
    } catch (err: any) {
      throw new WalletError(WalletErrors.IndexerAPIError, `Request failed ${url} with ${err}`, err)
    }
  },
  // Don't use post-request middleware! It clones the response. Same issue in Ky:
  // https://github.com/sindresorhus/ky/pull/356
})
