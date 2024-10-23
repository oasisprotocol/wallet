import { Validator } from 'app/state/staking/types'
import { parseRoseStringToBaseUnitString } from 'app/lib/helpers'
import { Configuration, ValidatorApi, ValidatorInfo } from 'vendors/oasisscan-v2/index'

import { throwAPIErrors } from './helpers'

export function getOasisscanV2APIs(url: string | 'https://api.oasisscan.com/v2/mainnet') {
  const explorerConfig = new Configuration({
    basePath: url,
    ...throwAPIErrors,
  })

  const validatorApi = new ValidatorApi(explorerConfig)

  async function getAllValidators(): Promise<Validator[]> {
    const validators = await validatorApi.validatorListHandler({ orderBy: 'escrow', sort: 'desc' })
    if (!validators) throw new Error('Wrong response code')

    return parseValidatorsList(validators.list)
  }

  async function getTransactionsList(params: { accountId: string; limit: number }) {
    return []
  }

  return {
    getAllValidators,
    getTransactionsList,
  }
}

function parseValidatorsList(validators: ValidatorInfo[]): Validator[] {
  return validators.map(v => {
    const parsed: Validator = {
      address: v.entityAddress,
      name: v.name ?? undefined,
      escrow: parseRoseStringToBaseUnitString(v.escrow),
      current_rate: v.commission,
      status: v.status ? 'active' : 'inactive',
      media: {
        email_address: v.email ?? undefined,
        logotype: v.icon ?? undefined,
        twitter_acc: v.twitter ?? undefined,
        website_link: v.website ?? undefined,
      },
      rank: v.rank,
    }
    return parsed
  })
}
