import { TFunction } from 'i18next'
import { ExhaustedTypeError } from 'types/errors'
import { ParaTime } from '../../../config'

export const getParaTimeName = (t: TFunction, paraTime: ParaTime) => {
  switch (paraTime) {
    case ParaTime.Cipher:
      // Discourage mistaken ParaTime deposits into Cipher accounts controlled
      // by Binance. That requires contacting support to recover it.
      return `${t('paraTimes.common.cipher', 'Cipher')} ${t(
        'paraTimes.common.discouragedType',
        '(experimental)',
      )}`
    case ParaTime.Emerald:
      return t('paraTimes.common.emerald', 'Emerald')
    case ParaTime.Sapphire:
      return t('paraTimes.common.sapphire', 'Sapphire')
    default:
      throw new ExhaustedTypeError(
        t('paraTimes.validation.unsupportedParaTime', 'Unsupported ParaTime'),
        paraTime,
      )
  }
}
